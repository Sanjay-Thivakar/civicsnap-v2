export default function AdminAnalytics({ unresolved = [], resolved = [] }) {
  const countBy = (items, key) =>
    items.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});

  const byCategory = countBy(resolved, "category");
  const bySeverity = countBy(resolved, "severity");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* TOTAL COUNTS */}
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">Unresolved Issues</p>
        <p className="text-2xl font-bold">{unresolved.length}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">Resolved Issues</p>
        <p className="text-2xl font-bold">{resolved.length}</p>
      </div>

      {/* BY CATEGORY */}
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm font-semibold mb-2">By Category</p>
        {Object.keys(byCategory).length === 0 ? (
          <p className="text-sm text-gray-400">No data</p>
        ) : (
          Object.entries(byCategory).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))
        )}
      </div>

      {/* BY SEVERITY */}
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm font-semibold mb-2">By Severity</p>
        {Object.keys(bySeverity).length === 0 ? (
          <p className="text-sm text-gray-400">No data</p>
        ) : (
          Object.entries(bySeverity).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
