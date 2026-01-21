// app/api/category/english/[category]/route.js
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const cat = params.category;
    const posts = await Post.find({ category_en: cat }).sort({ createdAt: -1 }).populate("author", "name email");
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
