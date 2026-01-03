import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function UnresolvedIssues() {
  const [recent, setRecent] = useState([]);
  const [all, setAll] = useState([]);

  useEffect(() => {
    // LAST 4 RECENT
    const recentQuery = query(
      collection(db, "issues"),
      where("status", "==", "unresolved"),
      orderBy("createdAt", "desc","id"),
      limit(4)
    );

    const unsubRecent = onSnapshot(recentQuery, (snap) => {
      setRecent(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // ALL UNRESOLVED
    const allQuery = query(
      collection(db, "issues"),
      where("status", "==", "unresolved"),
      orderBy("createdAt", "desc","id")
    );

    const unsubAll = onSnapshot(allQuery, (snap) => {
      setAll(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubRecent();
      unsubAll();
    };
  }, []);

  const IssueCard = ({ issue }) => (
    <div className="flex border rounded p-3 bg-white shadow">
      <img
        src={issue.imageUrl}
        alt="issue"
        className="w-24 h-24 object-cover rounded mr-4"
      />

      <div>
        <h4 className="font-semibold">{issue.title || "Untitled Issue"}</h4>

        <p className="text-sm text-gray-600 mt-1">
          {issue.description || "No description provided"}
        </p>

        <div className="mt-2 space-x-2">
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
            {issue.category}
          </span>
          <span className="text-xs bg-green-200 px-2 py-1 rounded">
            {issue.severity}
          </span>
          <span className="text-xs bg-red-200 px-2 py-1 rounded">
            unresolved
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* TOP: LAST 4 */}
      <h3 className="text-lg font-semibold mb-4">Latest Unresolved Issues</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {recent.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>

      {/* BOTTOM: ALL */}
      <h3 className="text-lg font-semibold mb-4">All Unresolved Issues</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {all.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </>
  );
}
