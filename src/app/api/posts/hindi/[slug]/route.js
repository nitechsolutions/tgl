import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export async function GET(req, {params}) {
  await connectDB();

  try {
    const { slug } = await params;
    console.log("hello from api/posts/hindi/[slug]/route.js");
    
    console.log("Slug received:", slug);

    if (!slug) {
      return new Response(JSON.stringify({ error: "slug missing" }), {
        status: 400,
      });
    }

    const post = await Post.findById(slug).populate("author", "name email");

    if (!post) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    post.views = (post.views || 0) + 1;
    await post.save();

    return new Response(JSON.stringify(post), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
