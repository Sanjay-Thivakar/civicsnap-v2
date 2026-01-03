import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

import IssueCard from "../components/IssueCard";
import GeoTagSection from "../components/GeoTagSection";
import IssueHeatMap from "../components/IssueHeatMap";
import AdminAnalytics from "../components/AdminAnalytics";
import ResolvedPerDayChart from "../components/ResolvedPerDayChart";
import FadeIn from "../components/FadeIn";

export default function AdminDashboard() {
  const [unresolvedIssues, setUnresolvedIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);

  useEffect(() => {
    const unresolvedQuery = query(
      collection(db, "issues"),
      where("status", "==", "unresolved"),
      orderBy("createdAt", "desc")
    );

    const unsubUnresolved = onSnapshot(unresolvedQuery, (snap) => {
      setUnresolvedIssues(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    const resolvedQuery = query(
      collection(db, "issues"),
      where("status", "==", "resolved"),
      orderBy("createdAt", "desc"),
      limit(6)
    );

    const unsubResolved = onSnapshot(resolvedQuery, (snap) => {
      setResolvedIssues(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => {
      unsubUnresolved();
      unsubResolved();
    };
  }, []);

  const resolveIssue = async (id) => {
    const confirm = window.confirm("Mark this issue as resolved?");
    if (!confirm) return;

    await updateDoc(doc(db, "issues", id), {
      status: "resolved",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* 🔹 ADMIN WELCOME */}
      <FadeIn>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-5 shadow">
          <h2 className="font-semibold text-xl mb-2">Admin Control Panel 🛠️</h2>

          <p className="text-sm mb-3 opacity-90">
            Monitor, verify, and resolve civic issues reported by users across
            the city.
          </p>

          <ul className="text-sm list-disc pl-5 space-y-1 opacity-90">
            <li>Review unresolved issues submitted by citizens</li>
            <li>Verify issues using images and geo-location</li>
            <li>Resolve issues once action has been taken</li>
            <li>Track resolved issue history for accountability</li>
          </ul>
        </div>
      </FadeIn>

      {/* 🔹 ANALYTICS */}
      <FadeIn delay={0.1}>
        <AdminAnalytics
          unresolved={unresolvedIssues}
          resolved={resolvedIssues}
        />
      </FadeIn>

      {/* 🔹 RESOLVED PER DAY CHART */}
      <FadeIn delay={0.15}>
        <ResolvedPerDayChart resolvedIssues={resolvedIssues} />
      </FadeIn>

      {/* 🔹 UNRESOLVED ISSUES */}
      <FadeIn delay={0.2}>
        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">
            Unresolved Issues
          </h3>

          {unresolvedIssues.length === 0 ? (
            <p className="text-sm text-gray-500">No unresolved issues 🎉</p>
          ) : (
            <div className="space-y-3">
              {unresolvedIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onResolve={resolveIssue}
                />
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {/* 🔹 RESOLVED ISSUES HISTORY */}
      <FadeIn delay={0.25}>
        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800">
            Resolved Issues History
          </h3>

          {resolvedIssues.length === 0 ? (
            <p className="text-sm text-gray-500">No resolved issues yet.</p>
          ) : (
            <div className="space-y-3">
              {resolvedIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {/* 🔹 MAP + HEATMAP */}
      <FadeIn delay={0.3}>
        <div className="bg-white rounded-lg shadow border p-4">
          <h3 className="font-semibold mb-2 text-gray-800">
            Issue Locations & Density
          </h3>

          <GeoTagSection issues={unresolvedIssues} />
          <IssueHeatMap issues={unresolvedIssues} />
        </div>
      </FadeIn>
    </div>
  );
}
