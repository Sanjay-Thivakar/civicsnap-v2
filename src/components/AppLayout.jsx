import { Link } from "react-router-dom";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold">CivicSnap</h1>

        <nav className="flex gap-4">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
