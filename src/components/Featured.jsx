import { stripHtml } from "@/lib/stripHtml";
import Link from "next/link";

export default function Featured({ post }) {
    const description = stripHtml(post.description_hi)
  
  return (
    <div className="flex flex-col mt-6 lg:flex-row w-full gap-6">
      <img
        src={post.image}
        alt=""
        className="w-full lg:w-1/2 h-80 object-cover rounded-lg"
      />

      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <a
          href={`${post._id}`}
          className="hover:underline text-2xl font-bold"
        >
          {post.title_hi}...
        </a>
        <p
          className="text-gray-600 dark:text-gray-600 mt-4"
          >

       {description?.substring(0, 250)}...`,
          </p>

        <div>
          <Link
            href={`/category/${encodeURIComponent(post.category_hi)}`}
            className="mt-5 inline-block text-White-600 text-lg border rounded-full font-semibold px-4 "
          >
            {post.category_hi} →
          </Link>
        </div>
      </div>
    </div>
  );
}
