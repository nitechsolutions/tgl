"use client";

import { useEffect, useState } from "react";
import Card from "./Card";
import Pagination from "./ui/Pagination";

export default function CardList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  
  useEffect(() => {
    async function loadPosts(currentPage) {
    const res = await fetch(
      `http://localhost:3000/api/posts?type=latest&page=${currentPage}&limit=${limit}`
    );
    const data = await res.json();

    setPosts(data.posts);
    setTotalPages(data.pagination.totalPages);
  }

    loadPosts(page);
  }, [page]);

  return (
    <div className="lg:col-span-2 space-y-14">
      {posts.map((p) => (
        <Card key={p._id} post={p} />
      ))}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
