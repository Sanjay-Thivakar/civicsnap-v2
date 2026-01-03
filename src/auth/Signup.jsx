import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", res.user.uid));
    const role = snap.data().role;
    navigate(role === "admin" ? "/admin" : "/user");
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Login</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="relative mb-2">
        <input
          className="border p-2 w-full pr-16"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-2 text-sm text-blue-600"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <button className="bg-black text-white px-4 py-2 w-full">Login</button>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline font-medium">
          Sign up
        </a>
      </p>
    </form>
  );
}
