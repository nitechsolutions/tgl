// app/api/category/hindi/[category]/route.js
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const {category} = await params;
    console.log(category);

    if (!category) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
      });
    }
    
    const posts = await Post.find({ category_hi: category }).limit(6).sort({ createdAt: -1 }).populate("author", "name email");
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
