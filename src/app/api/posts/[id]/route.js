import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { requireOwnerOrAdmin } from "@/lib/roles";
import cloudinary from "@/lib/cloudinary";

// =========================================================
//                      GET POST
// =========================================================
export async function GET(req, { params }) {
  await connectDB();
  const postId = await params
  console.log("This is the params id", postId.id);
  
  const post = await Post.findById(postId.id);

  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  return NextResponse.json(post);
}

// =========================================================
//                      UPDATE POST
// =========================================================
export async function PUT(req, { params }) {
  await connectDB();
  const postId = await params

  const user = getUserFromCookies(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await Post.findById(postId.id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Only admin or owner can update
  if (!requireOwnerOrAdmin(user, post)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();

  const title_hi = form.get("title_hi");
  const slug_hi = form.get("slug_hi");
  const category_hi = form.get("category_hi");
  const description_hi = form.get("description_hi");

  const featured = form.get("featured") === "true";
  const trending = form.get("trending") === "true";
  const tags = JSON.parse(form.get("tags") || "[]");

  const newImage = form.get("image");

  let imageURL = post.image;

  // =============== Upload New Image If Provided ===============
  if (newImage && newImage.name) {
    const buffer = Buffer.from(await newImage.arrayBuffer());

    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "blog_images" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(buffer);
    });

    imageURL = uploaded.secure_url;
  }

  // =============== Update DB ===============
  post.title_hi = title_hi;
  post.slug_hi = slug_hi;
  post.category_hi = category_hi;
  post.description_hi = description_hi;
  post.featured = featured;
  post.trending = trending;
  post.tags = tags;
  post.image = imageURL;

  await post.save();

  return NextResponse.json({ message: "Updated successfully", post });
}

// =========================================================
//                      DELETE POST
// =========================================================
export async function DELETE(req, { params }) {
  await connectDB();
  const postId = await params

  const user = getUserFromCookies(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await Post.findById(postId.id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Only admin or owner
  if (!requireOwnerOrAdmin(user, post)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await post.deleteOne();

  return NextResponse.json({ message: "Deleted successfully" });
}
