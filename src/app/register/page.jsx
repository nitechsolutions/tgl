"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMsg("Account created successfully!");
      setTimeout(() => router.push("/login"), 500);
    } else {
      setMsg(data.error || "Registration failed.");
    }
  };

  return (
    <div className="py-15 flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">

        <h1 className="text-2xl font-bold mb-5 text-center">Create Account</h1>

        {msg && <p className="text-center text-sm text-red-600 mb-3">{msg}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-3"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold p-3 rounded-lg transition"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
