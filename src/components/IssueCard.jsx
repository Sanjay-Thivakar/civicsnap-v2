export default function IssueCard({ issue, onResolve }) {
  return (
    <div className="flex gap-4 border rounded-lg p-4 bg-white shadow-sm">
      <img
        src={issue.imageUrl}
        alt="issue"
        className="w-32 h-32 object-cover rounded"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{issue.userTitle}</h3>

        <p className="text-sm text-gray-600 mb-2">{issue.userDescription}</p>

        <div className="flex gap-2 flex-wrap text-sm">
          <span className="px-2 py-1 bg-gray-100 rounded">
            Category: {issue.category}
          </span>

          <span
            className={`px-2 py-1 rounded text-white ${
              issue.severity === "high"
                ? "bg-red-600"
                : issue.severity === "medium"
                ? "bg-yellow-500"
                : "bg-green-600"
            }`}
          >
            {issue.severity.toUpperCase()}
          </span>

          <span className="px-2 py-1 bg-blue-100 rounded">
            Status: {issue.status}
          </span>
        </div>

        {onResolve && (
          <button
            onClick={() => onResolve(issue.id)}
            className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
          >
            Resolve Issue
          </button>
        )}
      </div>
    </div>
  );
}
