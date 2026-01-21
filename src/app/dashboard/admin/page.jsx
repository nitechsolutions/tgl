"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <p className="mt-3 text-gray-600">
        You have full control over posts and users.
      </p>

      <div className="mt-4 space-x-4">
        <Link href="/admin/posts" className="px-4 py-2 bg-purple-600 text-white rounded">
          Manage Posts
        </Link>

        <Link href="/admin/horoscope" className="px-4 py-2 bg-purple-600 text-white rounded">
          Manage Horoscope
        </Link>

        <Link href="/admin/users" className="px-4 py-2 bg-green-600 text-white rounded">
          Manage Users
        </Link>
      </div>
    </div>
  );
}
