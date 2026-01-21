"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/posts");  // <-- remove localhost (fix SSR issues)
      const j = await res.json();

      console.log("API RESPONSE:", j);

      setPosts(j); // <-- safe fallback
    } catch (err) {
      console.error("Error loading posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

    if (res.ok) load();
    else alert("Delete failed");
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin - Posts</h1>
        <Link href="/write" className="px-4 py-2 bg-indigo-600 text-white rounded">
          Create New
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 && <p>No posts found</p>}

          {posts.map((p) => (
            <div key={p._id} className="p-4 border rounded flex justify-between items-start gap-2">
              <div className="flex  gap-3">

                <img src={p.image} alt="" srcset="" className="w-25"/>
                <div className="flex flex-col gap-2">
                <h2 className="font-semibold">{ p.title_hi }</h2>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(p.createdAt).toLocaleString()}
                </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/edit/${p._id}`} className="px-3 py-1 bg-yellow-200 rounded">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 bg-red-200 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
