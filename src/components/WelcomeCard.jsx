export default function WelcomeCard() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Welcome to CivicSnap 👋</h2>
      <p className="text-gray-600 mb-4">
        CivicSnap helps citizens report public infrastructure issues like
        potholes, sewage leaks, broken streetlights, and more — directly with
        location and evidence.
      </p>
      <ul className="list-disc ml-5 text-gray-600 space-y-1">
        <li>Click Report Issue to submit a new problem with an image</li>
        <li>Your location is automatically attached for accuracy</li>
        <li>Track unresolved issues reported by the community</li>
        <li>Authorities review and resolve reported issues</li>
      </ul>
    </div>
  );
}
