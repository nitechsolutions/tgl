// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) setUser(await res.json());
    }
    load();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome, {user.name} 👋</h1>
      <p className="mt-2 text-gray-600">Role: {user.role.toUpperCase()}</p>
    </div>
  );
}
