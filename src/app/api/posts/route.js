// app/api/posts/route.js
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/auth";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

function slugifyHindi(str = "") {
  return str
    .toString()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u0900-\u097F-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 160);
}

function slugifyEnglish(str = "") {
  return str
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 160);
}

export async function GET(req) {
  await connectDB();

  try {
    const url = new URL(req.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "6", 10);
    const type = url.searchParams.get("type");
    const category = url.searchParams.get("category");

    const skip = (page - 1) * limit;

    const filter = {};
    if (type === "featured") filter.featured = true;
    if (type === "trending") filter.trending = true;
    if (category) filter.category_hi = category;

    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name");      

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function POST(req) {
  await connectDB();

  try {
    // ----------------- AUTH CHECK -----------------
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user;
    try {
      user = verifyToken(token);
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!["writer", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // ----------------- READ FORM DATA -----------------
    const form = await req.formData();

    const title_hi = form.get("title_hi");
    const slug_hi = form.get("slug_hi");
    const category_hi = form.get("category_hi");
    const description_hi = form.get("description_hi");
    const featured = form.get("featured") === "true";
    const trending = form.get("trending") === "true";
    const tags = JSON.parse(form.get("tags") || "[]");

    const imageFile = form.get("image");

    if (!title_hi || !slug_hi || !description_hi) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // ----------------- CLOUDINARY UPLOAD -----------------
    let imageURL = "";

    if (imageFile && imageFile.name) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "tgl_blog_images" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      imageURL = uploaded.secure_url;
    }

    // ----------------- SAVE TO DATABASE -----------------
    const newPost = await Post.create({
      title_hi,
      slug_hi,
      category_hi,
      description_hi,
      featured,
      trending,
      image: imageURL,
      tags,
      author: user.id,
    });

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


