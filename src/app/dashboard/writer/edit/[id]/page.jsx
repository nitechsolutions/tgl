"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import QuillEditor from "@/components/RichTextEditor";

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const editorHiRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    title_hi: "",
    slug_hi: "",
    category_hi: "",
    image: null,
    oldImage: "",
    tags: "",
    featured: false,
    trending: false,
  });

  // ------------------------------------------
  // LOAD POST BY ID
  // ------------------------------------------
  useEffect(() => {
    async function loadPost() {
        const postId = await params       
        
      const res = await fetch(`/api/posts/${postId.id}`);
      const post = await res.json();

      setForm({
        title_hi: post.title_hi,
        slug_hi: post.slug_hi,
        category_hi: post.category_hi,
        oldImage: post.image,
     description_hi: post.description_hi,

        tags: post.tags?.join(", "),
        featured: post.featured,
        trending: post.trending,
        image: null, // File upload field reset
      });

      setImagePreview(post.image);
      setLoading(false);

      setTimeout(() => {
        editorHiRef.current?.setHTML?.(post.description_hi );
      }, 300);
    }

    loadPost();
  }, [params.id]);

  // ------------------------------------------
  // QUILL MODULES
  // ------------------------------------------
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  // ------------------------------------------
  // INPUT CHANGE HANDLER
  // ------------------------------------------
  function handleChange(e) {
    const { name, type, checked, value, files } = e.target;

    if (type === "file") {
      const file = files?.[0];
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // ------------------------------------------
  // SLUG GENERATOR
  // ------------------------------------------
  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\u0900-\u097F\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function autoSlug() {
    if (!form.title_hi) return;
    setForm((prev) => ({ ...prev, slug_hi: generateSlug(prev.title_hi) }));
  }

  // ------------------------------------------
  // UPDATE POST
  // ------------------------------------------
  async function handleUpdate(e) {
    e.preventDefault();

    const description_hi = editorHiRef.current?.getHTML?.() || "";
    

    const fd = new FormData();
    fd.append("title_hi", form.title_hi);
    fd.append("slug_hi", form.slug_hi);
    fd.append("category_hi", form.category_hi);
    fd.append("description_hi", description_hi);
    fd.append("featured", form.featured);
    fd.append("trending", form.trending);
    fd.append(
      "tags",
      JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean))
    );

    if (form.image instanceof File) {
      fd.append("image", form.image);
    }
    const postId = await params
    const res = await fetch(`/api/posts/${postId.id}`, {
      method: "PUT",
      body: fd,
    });

    const json = await res.json();

    if (!res.ok) {
      alert("❌ Error: " + json.error);
      return;
    }

    alert("✅ Post Updated Successfully!");
    router.push("/dashboard/writer");
  }

  if (loading) return <p className="p-6">Loading...</p>;

  const previewHTML = editorHiRef.current?.getHTML?.() || "";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">पोस्ट संपादित करें</h1>

      <form className="space-y-5" onSubmit={handleUpdate}>
        {/* TITLE + SLUG */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="input"
            name="title_hi"
            placeholder="शीर्षक (Hindi)"
            value={form.title_hi}
            onChange={handleChange}
          />

          <div className="flex gap-2">
            <input
              className="input flex-1"
              name="slug_hi"
              placeholder="Slug (Hindi)"
              value={form.slug_hi}
              onChange={handleChange}
            />
            <button type="button" onClick={autoSlug} className="btn-gray">
              Auto
            </button>
          </div>
        </div>

        {/* CATEGORY */}
        <input
          className="input"
          name="category_hi"
          placeholder="श्रेणी (Category)"
          value={form.category_hi}
          onChange={handleChange}
        />

        {/* IMAGE UPLOAD */}
        <div>
          <label className="font-semibold">Featured Image</label>
          <input type="file" accept="image/*" className="input mt-1" onChange={handleChange} />

          {imagePreview && (
            <img
              src={imagePreview}
              className="w-full rounded mt-3 h-60 object-cover shadow"
            />
          )}
        </div>

        {/* TAGS */}
        <input
          className="input"
          name="tags"
          placeholder="टैग (कॉमा से अलग करें)"
          value={form.tags}
          onChange={handleChange}
        />

        {/* EDITOR */}
        <div>
          <label className="font-semibold">विवरण (Hindi)</label>
          <div className="border rounded p-2 bg-white">
            <QuillEditor
              ref={editorHiRef}
              initialValue={form.description_hi}
              modules={modules}
              placeholder="लेख सामग्री लिखें..."
            />
          </div>
        </div>

        {/* CHECKBOXES */}
        <div className="flex gap-6">
          <label className="flex gap-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Featured
          </label>

          <label className="flex gap-2">
            <input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} />
            Trending
          </label>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between">
          <button type="button" onClick={() => setShowPreview(true)} className="btn-gray px-4 py-2">
            👁 Preview
          </button>

          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">
            Update Post
          </button>
        </div>
      </form>

      {/* ------------------ PREVIEW MODAL ------------------ */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-6">
          <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-3">{form.title_hi}</h2>
            <p className="text-gray-600 mb-2">{form.category_hi}</p>

            {imagePreview && (
              <img src={imagePreview} className="w-full rounded mb-4 h-60 object-cover" />
            )}

            <div dangerouslySetInnerHTML={{ __html: previewHTML }} className="prose" />

            <button
              onClick={() => setShowPreview(false)}
              className="mt-4 px-5 py-2 bg-red-500 text-white rounded"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      <style>{`
        .input { padding:10px; border:1px solid #ddd; border-radius:6px; width:100%; }
        .btn-gray { padding: 8px 14px; background: #eee; border-radius:6px; }
      `}</style>
    </div>
  );
}
