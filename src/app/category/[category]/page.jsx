import Card from "@/components/Card";
import Link from "next/link";

async function getPosts(category) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/posts?category=${category}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function CategoryPage({ params }) {
  // console.log("log params ",params);

  const { category } = await params;
  const categoryDecoded = decodeURIComponent(category);

  //   const category = decodeURIComponent(params.category);
  // console.log("console Category",categoryDecoded);

  const data = await getPosts(categoryDecoded);

  const posts = data.posts || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">
          होम
        </Link>{" "}
        /
        <a
          href={`/category/${categoryDecoded}`}
          className="hover:underline mx-1"
        >
          {categoryDecoded}
        </a>
      </div>
      <h1 className="text-3xl font-bold mb-6  pb-2">
        {categoryDecoded} समाचार
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">इस श्रेणी में कोई पोस्ट उपलब्ध नहीं है।</p>
      ) : (
        <div className="space-y-10">
          {posts.map((post) => (
            <Card key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
