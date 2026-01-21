"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) setUser(await res.json());
    }
    loadUser();
  }, []);

  if (!user) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-6">
        <h2 className="text-xl font-bold">
          Dashboard <span className="text-orange-600">({user.role})</span>
        </h2>

        <nav className="space-y-3">
          <Link href="/dashboard" className="block px-3 py-2 bg-gray-100 rounded">
            Home
          </Link>

          {(user.role === "writer" ) && (
            <>
              <Link href="/dashboard/writer" className="block px-3 py-2 hover:bg-gray-100 rounded">
                Writer Panel
              </Link>
              <Link href="/dashboard/writer/create" className="block px-3 py-2 hover:bg-gray-100 rounded">
                Create Post
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <>
              <Link href="/dashboard/admin" className="block px-3 py-2 hover:bg-gray-100 rounded">
                Admin Panel
              </Link>
              <Link href="/dashboard/admin/posts" className="block px-3 py-2 hover:bg-gray-100 rounded">
                Manage Posts
              </Link>
               <Link href="/dashboard/admin/horoscope" className="block px-3 py-2 hover:bg-gray-100 rounded">
                Manage Horospcope
              </Link>
              <Link href="/dashboard/admin/users" className="block px-3 py-2 hover:bg-gray-100 rounded">
                Manage Users
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
