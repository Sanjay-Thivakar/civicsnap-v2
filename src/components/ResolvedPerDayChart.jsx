import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ResolvedPerDayChart({ resolvedIssues = [] }) {
  const counts = resolvedIssues.reduce((acc, issue) => {
    if (!issue.createdAt?.toDate) return acc;

    const date = issue.createdAt.toDate().toISOString().slice(0, 10); // YYYY-MM-DD

    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Issues Resolved Per Day 📊</h3>

      {data.length === 0 ? (
        <p className="text-sm text-gray-400">No resolved data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
