import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

import IssueCard from "../components/IssueCard";
import GeoTagSection from "../components/GeoTagSection";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [allUnresolved, setAllUnresolved] = useState([]);
  const [latestUnresolved, setLatestUnresolved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIssues() {
      try {
        // 🔹 ALL unresolved issues
        const allQuery = query(
          collection(db, "issues"),
          where("status", "==", "unresolved"),
          orderBy("createdAt", "desc")
        );

        const allSnap = await getDocs(allQuery);
        const allIssues = allSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 🔹 LATEST 4 unresolved issues
        const latestQuery = query(
          collection(db, "issues"),
          where("status", "==", "unresolved"),
          orderBy("createdAt", "desc"),
          limit(4)
        );

        const latestSnap = await getDocs(latestQuery);
        const latestIssues = latestSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllUnresolved(allIssues);
        setLatestUnresolved(latestIssues);
      } catch (err) {
        console.error("Failed to fetch issues", err);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 WELCOME CARD (UNCHANGED TEXT) */}
      <div className="border rounded p-4 bg-white">
        <h2 className="font-semibold text-lg mb-2">Welcome to CivicSnap 👋</h2>

        <p className="text-sm mb-2">
          CivicSnap helps citizens report public infrastructure issues like
          potholes, sewage leaks, broken streetlights, and more — directly with
          location and evidence.
        </p>

        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>Click Report Issue to submit a new problem with an image</li>
          <li>Your location is automatically attached for accuracy</li>
          <li>Track unresolved issues reported by the community</li>
          <li>Authorities review and resolve reported issues</li>
        </ul>

        <button
          onClick={() => navigate("/report")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Report an Issue
        </button>
      </div>

      {/* 🔹 LATEST UNRESOLVED */}
      <div>
        <h3 className="font-semibold mb-2">Latest Unresolved Issues</h3>

        {loading ? (
          <p>Loading issues...</p>
        ) : latestUnresolved.length === 0 ? (
          <p className="text-sm text-gray-500">No unresolved issues yet.</p>
        ) : (
          <div className="space-y-3">
            {latestUnresolved.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>

      {/* 🔹 ALL UNRESOLVED */}
      <div>
        <h3 className="font-semibold mb-2">All Unresolved Issues</h3>

        {loading ? (
          <p>Loading issues...</p>
        ) : allUnresolved.length === 0 ? (
          <p className="text-sm text-gray-500">No unresolved issues yet.</p>
        ) : (
          <div className="space-y-3">
            {allUnresolved.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>

      {/* 🔹 MAP */}
      <GeoTagSection issues={allUnresolved} />
    </div>
  );
}
