"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function WriterPanel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const res = await fetch("/api/posts?mine=true");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    }
    loadPosts();
  }, []);

  console.log(posts);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Writer Dashboard</h1>

      <Link
        href="/dashboard/writer/create"
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        + Create New Post
      </Link>

      <div className="mt-6 space-y-3">
        {Array.isArray(posts) &&
          posts.map((p) => (
            <div
              key={p._id}
              className="p-4 border rounded flex justify-between"
            >
              <div>
                <h3 className="font-semibold">{p.title_hi}</h3>
                <p className="text-xs text-gray-500">{p.category_hi}</p>
              </div>

              <Link
                href={`/dashboard/writer/edit/${p._id}`}
                className="px-3 py-1 bg-yellow-400 rounded"
              >
                Edit
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
