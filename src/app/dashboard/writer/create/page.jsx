"use client";

import { useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import QuillEditor from "@/components/RichTextEditor";

export default function CreateBlogPage() {
  const router = useRouter();
  const editorHiRef = useRef(null);

  const [form, setForm] = useState({
    title_hi: "",
    slug_hi: "",
    category_hi: "",
    image: null,
    tags: "",
    featured: false,
    trending: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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

  function handleChange(e) {
    const { name, type, checked, value, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // ---------------- SLUG GENERATOR ----------------
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

  // ---------------- FORM SUBMIT ----------------
  async function handleSubmit(e) {
    e.preventDefault();

    const description_hi = editorHiRef.current?.getHTML?.() || "";

    const fd = new FormData();
    fd.append("title_hi", form.title_hi);
    fd.append("slug_hi", form.slug_hi);
    fd.append("category_hi", form.category_hi);
    fd.append("description_hi", description_hi);
    fd.append("featured", form.featured);
    fd.append("trending", form.trending);

    if (form.image) fd.append("image", form.image);
    fd.append(
      "tags",
      JSON.stringify(
        form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

    const res = await fetch("/api/posts", {
      method: "POST",
      body: fd,
    });

    const json = await res.json();
    if (!res.ok) {
      alert("❌ Error: " + json.error);
      return;
    }

    alert("✅ पोस्ट सफलतापूर्वक प्रकाशित हो गया!");
    router.push("/dashboard/writer");
  }

  // ---------------- PREVIEW DATA ----------------
  const previewHTML = editorHiRef.current?.getHTML?.() || "";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">नई पोस्ट लिखें</h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Title + Slug */}
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

        {/* Category */}
        <select
          name="category_hi"
          value={form.category_hi}
          onChange={handleChange}
          className="input "
        >
          <option value="">श्रेणी चुनें (Category)</option>
          <option value="भारत">भारत</option>
          <option value="ऑटोमोबाईल">ऑटोमोबाईल</option>
          <option value="टेक्नोलॉजी">टेक्नोलॉजी</option>
          <option value="लाइफस्टाइल">लाइफस्टाइल</option>
          <option value="हेल्थ">हेल्थ</option>
          <option value="बिजनेस">बिजनेस</option>
          <option value="क्रिकेट">क्रिकेट</option>
          <option value="दुनिया">दुनिया</option>
          <option value="एजुकेशन">एजुकेशन</option>
          <option value="खेल">खेल</option>
          <option value="मनोरंजन">मनोरंजन</option>
        </select>
        

        {/* Image Upload */}
        <div>
          <label className="font-semibold">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="input file:mr-4 file:rounded-full file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-100 hover:file:text-violet-700"
          />

          {imagePreview && (
            <img
              src={imagePreview}
              className="w-full rounded mt-3 h-60 object-cover"
            />
          )}
        </div>

        {/* Tags */}
        <input
          className="input"
          name="tags"
          placeholder="टैग (कॉमा से अलग करें)"
          value={form.tags}
          onChange={handleChange}
        />

        {/* Editor */}
        <div>
          <label className="font-semibold">विवरण (Hindi)</label>
          <div className="border rounded p-2 bg-white">
            <QuillEditor
              ref={editorHiRef}
              initialValue=""
              modules={modules}
              placeholder="लेख सामग्री लिखें..."
            />
          </div>
        </div>

        {/* Featured + Trending */}
        <div className="flex gap-6">
          <label className="flex gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Featured
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              name="trending"
              checked={form.trending}
              onChange={handleChange}
            />
            Trending
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-5 py-2 bg-gray-200 rounded"
          >
            👁 Preview
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded"
          >
            Publish
          </button>
        </div>
      </form>

      {/* ================= PREVIEW MODAL ================= */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-6">
          <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-3">{form.title_hi}</h2>
            <p className="text-gray-600 mb-3">{form.category_hi}</p>

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-full rounded mb-4 h-60 object-cover"
              />
            )}

            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: previewHTML }}
            />

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
