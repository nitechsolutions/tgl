"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [toast, setToast] = useState(null); // 👈 Popup message

  async function loadPosts() {
    const res = await fetch("/api/posts");
    if (res.ok) setPosts(await res.json());
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(p) {
    const ok = confirm(`Delete this post?\n\n"${p.title_hi}"`);
    if (!ok) return;

    const res = await fetch(`/api/posts/${p._id}`, { method: "DELETE" });
    const json = await res.json();

    if (!res.ok) {
      alert("Error deleting");
      return;
    }

    // Remove it from UI
    setPosts((prev) => prev.filter((item) => item._id !== p._id));

    // Show Toast
    setToast(`Post "${p.title_hi}" deleted successfully!`);

    // Auto-hide toast after 3 sec
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="relative">

      {/* ---------- Popup Notification ---------- */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out z-50">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-bold">All Posts</h1>

      <div className="mt-6 space-y-3">
        {posts.map((p) => (
          <div
            key={p._id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{p.title_hi}</h2>
              <p className="text-xs text-gray-500">{p.category_hi}</p>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/dashboard/admin/edit/${p._id}`}
                className="px-3 py-1 bg-yellow-400 rounded"
              >
                Edit
              </Link>

              <button
                className="px-3 py-1 bg-red-400 rounded"
                onClick={() => handleDelete(p)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }

        .animate-fade-in-out {
          animation: fadeInOut 3s forwards;
        }
      `}</style>
    </div>
  );
}
