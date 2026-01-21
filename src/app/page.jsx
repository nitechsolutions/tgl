// app/page.jsx (Home Page)

import Featured from "@/components/Featured";
import CardList from "@/components/CardList";
import HoroscopeCard from "@/components/HoroscopeCard";
import SideList from "@/components/SideList";

async function getData(endpoint) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${base}${endpoint}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const featuredRes = await getData("/api/posts?type=featured&limit=1");
const featuredPost = featuredRes?.posts?.[0] || null;


const latestRes = await getData("/api/posts?type=latest&limit=7");
const latestPosts = latestRes?.posts || [];

const trendingRes = await getData("/api/posts?type=trending&limit=6");
const trendingPosts = trendingRes?.posts || [];

  // console.log("featured post",featuredPost);
  
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-10">
        
        {/* FEATURED POST */}
        {featuredPost && <Featured post={featuredPost} />}

        {/* LATEST POSTS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
          <CardList />
        </section>
      </div>

      {/* RIGHT SIDE */}
      <aside>
        <HoroscopeCard />
        <SideList trendingPost={trendingPosts} />
      </aside>
    </div>
  );
}
