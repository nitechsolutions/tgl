// app/hi/post/[slug]/page.jsx

import RelatedPost from "@/components/RelatedPost";
import SinglePost from "@/components/SinglePost";
import Link from "next/link";

// 🚫 Do NOT add "use client" here — dynamic routes must be server components

async function getPost(slug) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/posts/hindi/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

async function getRelated(category) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(
    `${base}/api/category/hindi/${encodeURIComponent(category)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function ArticlePage({ params }) {
  // ✅ FIX: params is ALWAYS available here in server components
  const { slug } = await params;
  console.log("id", slug);

  // Fetch the main article
  const post = await getPost(slug);
  if (!post) {
    return (
      <div className="p-10 text-center text-lg font-semibold">
        लेख नहीं मिला (Article Not Found)
      </div>
    );
  }

  // Fetch related by category
  const related = await getRelated(post.category_hi);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-10">
        {/* ---------------- Breadcrumbs ---------------- */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:underline">
            होम
          </Link>{" "}
          /
          <Link
            href={`/hi/category/${post.category_hi}`}
            className="hover:underline mx-1"
          >
            {post.category_hi}
          </Link>
          /
          <span className="text-gray-500 ml-1 font-medium">
            {post.title_hi?.slice(0, 40)}...
          </span>
        </div>

        <SinglePost post={post} />

        {/* <div className="grid md:grid-cols-2 gap-6">
          {related
            .filter((item) => item.slug_hi !== post.slug_hi)
            .slice(0, 4)
            .map((item) => (
              <a
                href={`/hi/post/${item.slug_hi}`}
                key={item._id}
                className="flex gap-4 hover:bg-gray-50 rounded-lg p-3 transition"
              >
                <img
                  src={item.image}
                  className="w-28 h-20 object-cover rounded-md"
                  alt={item.title_hi}
                />
                <p className="font-medium leading-snug">
                  {item.title_hi?.slice(0, 70)}...
                </p>
              </a>
            ))}
        </div> */}
      </div>
      <aside className="sticky top-1">
        <h2 className="text-2xl font-bold mb-4">संबंधित खबरें </h2>
       <RelatedPost posts={related} currentSlug={post.slug_hi} />
        <div className="mt-10 text-center">
          <a
            href={`/hi/category/${post.category_hi}`}
            className="text-orange-600 font-semibold hover:underline"
          >
            {post.category_hi} की सभी खबरें →
          </a>
        </div>
      </aside>
    </div>
  );
}
