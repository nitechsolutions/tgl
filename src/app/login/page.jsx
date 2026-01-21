"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-change")); // notify topbar
      router.push("/");
    } else {
      setMsg(data.error);
    }
  };

  return (
    <div className="py-10 flex justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-5 text-center">Login</h1>

        {msg && <p className="text-center text-sm text-red-600 mb-3">{msg}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-orange-600 text-white p-3 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm mt-4">
          Already have not any account?{" "}
          <a href="/register" className="text-orange-600 font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
