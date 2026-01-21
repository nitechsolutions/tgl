// models/Post.js
import mongoose from "mongoose";
import "./User"

const PostSchema = new mongoose.Schema({
  title_hi: { type: String },
  title_en: { type: String },
  slug_hi: { type: String, unique: true, sparse: true },
  slug_en: { type: String, unique: true, sparse: true },

  category_hi: { type: String },
  category_en: { type: String },

  excerpt_hi: { type: String },
  excerpt_en: { type: String },

  description_hi: { type: String }, // HTML content
  description_en: { type: String },

  image: String,
  tags: { type: [String], default: [] },

  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  views: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
