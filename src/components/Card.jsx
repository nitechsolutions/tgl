"use client";

import { stripHtml } from "@/lib/stripHtml";
import Link from "next/link";

export default function Card({ post }) {
  const description = stripHtml(post.description_hi)
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full h-40 md:w-1/3 bg-gray-200">
        <img
          src={post.image}
          alt={post.title_hi}
          className="rounded-lg md:object-fill object-cover w-full h-full"
        />
      </div>

      <div className="w-full md:w-full flex flex-col justify-center">
        <Link   href={`/${post._id}`} className="text-xl font-semibold mb-1 leading-snug hover:underline">
          {post.title_hi}
        </Link>

        <p
          className="text-gray-600 text-sm">          
            {description.substring(0, 250)}...
          </p>


        <div className="mt-2 flex justify-between items-center">
          <Link
            href={`/category/${encodeURIComponent(post.category_hi)}`}
            className="inline-block text-sm border rounded-full px-4 "
          >
            {post.category_hi} →
          </Link>

          <Link
            href={`/${post._id}`}
            className="text-orange-600 font-semibold text-sm hover:underline"
          >
            और पढ़ें →
          </Link>
        </div>
      </div>
    </div>
  );
}
