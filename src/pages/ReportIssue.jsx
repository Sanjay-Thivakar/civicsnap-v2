import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";

export default function ReportIssue() {
  const [userTitle, setUserTitle] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [category, setCategory] = useState("sewage");
  const [severity, setSeverity] = useState("medium");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Please login again");
      return;
    }

    if (!image) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // 1️⃣ Upload Image
          const imageRef = ref(
            storage,
            `issues/${auth.currentUser.uid}/${Date.now()}_${image.name}`
          );

          await uploadBytes(imageRef, image);
          const imageUrl = await getDownloadURL(imageRef);

          // 2️⃣ Save Issue (AI will be handled by Cloud Function)
          await addDoc(collection(db, "issues"), {
            userTitle,
            userDescription,
            category,
            severity,
            imageUrl,
            status: "unresolved",
            createdBy: auth.currentUser.uid,
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
            createdAt: serverTimestamp(),
          });

          alert("Issue reported successfully!");
          setUserTitle("");
          setUserDescription("");
          setImage(null);
        } catch (err) {
          console.error(err);
          alert("Failed to submit issue");
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Location permission is required");
        setLoading(false);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Report an Issue</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Issue title"
        value={userTitle}
        onChange={(e) => setUserTitle(e.target.value)}
        required
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Describe the issue"
        value={userDescription}
        onChange={(e) => setUserDescription(e.target.value)}
        required
      />

      <select
        className="border p-2 w-full mb-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="sewage">Sewage</option>
        <option value="pothole">Pothole</option>
        <option value="streetlight">Street Light</option>
        <option value="garbage">Garbage</option>
        <option value="water">Water Issue</option>
      </select>

      <select
        className="border p-2 w-full mb-3"
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="file"
        accept="image/*"
        className="mb-4"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />

      <button
        disabled={loading}
        className="bg-blue-700 text-white w-full py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Issue"}
      </button>
    </form>
  );
}
