import React from "react";
import Link from "next/link";

export default function SinglePost({ post }) {
  return (
    <article>
      {/* ---------------- TITLE ---------------- */}
      <h1 className="text-3xl font-bold leading-snug mb-4">
        {post.title_hi}
      </h1>

      {/* ---------------- META INFO ---------------- */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
        <span>
          📅 {new Date(post.createdAt).toLocaleDateString("hi-IN")}
        </span>
        <span>👁 {post.views} Views</span>
      </div>

      {/* ---------------- MAIN IMAGE ---------------- */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title_hi}
          className="w-full max-h-[450px] object-contain bg-gray-200 rounded-lg mb-6"
          loading="lazy"
        />
      )}

      {/* ---------------- FULL ARTICLE CONTENT ---------------- */}
      <div
        className="prose prose-lg max-w-none leading-relaxed text-gray-800"
        dangerouslySetInnerHTML={{ __html: post.description_hi }}
      />

      {/* ---------------- TAGS (SEO IMPORTANT) ---------------- */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            🔖 टैग्स:
          </h3>

          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <li key={index}>
                <Link
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="text-sm px-3 py-1 bg-gray-100 hover:bg-indigo-100 text-blue-700 rounded-full transition"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
