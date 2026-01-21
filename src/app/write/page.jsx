// app/create-blog/page.jsx
"use client";

import { useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import QuillEditor from "@/components/RichTextEditor";

export default function CreateBlogPage() {
  const router = useRouter();
  const editorHiRef = useRef(null);
  const editorEnRef = useRef(null);

  console.log(editorHiRef.current?.getDelta?.());
  
  const [form, setForm] = useState({
    title_hi: "",
    title_en: "",
    slug_hi: "",
    slug_en: "",
    category_hi: "",
    category_en: "",
    excerpt_hi: "",
    excerpt_en: "",
    image: "",
    tags: "",
    featured: false,
    trending: false,
  });

  const [previewModeHi, setPreviewModeHi] = useState(false);
  const [previewModeEn, setPreviewModeEn] = useState(false);


  const modules = useMemo(()=>({
    toolbar: [
      [{ header: [1,2,false] }],
      ["bold","italic","underline"],
      [{ list: "ordered"}, { list: "bullet" }],
      ["link", "image"],
      ["clean"]
    ]
  }), []);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function generateSlug(text){
    return text?.toLowerCase().trim()
      .replace(/[^\w\u0900-\u097F\s-]/g,'')
      .replace(/\s+/g,'-').replace(/-+/g,'-');
  }

  function autoSlug(lang) {
    const title = lang === "en" ? form.title_en : form.title_hi;
    if(!title) return;
    const slugField = lang === "en" ? "slug_en" : "slug_hi";
    setForm(prev => ({ ...prev, [slugField]: generateSlug(title) }));
  }

  async function submit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      description_hi_html: editorHiRef.current?.getHTML?.() || "",
      description_en_html: editorEnRef.current?.getHTML?.() || "",
      description_hi_delta: editorHiRef.current?.getDelta?.() || null,
      description_en_delta: editorEnRef.current?.getDelta?.() || null,
      tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean)
    };

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const j = await res.json().catch(()=>({}));
      alert("Error: "+(j.error||"Failed"));
      return;
    }

    const j = await res.json();
    alert("Created");
    // navigate to admin or post page
    router.push("/admin");
  }

  const currentDescriptionHi = editorHiRef.current?.getHTML?.() || "";
  const currentDescriptionEn = editorEnRef.current?.getHTML?.() || "";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Blog Post</h1>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="title_hi" placeholder="Title (हिंदी)" value={form.title_hi} onChange={handleChange} className="input" />
          <input name="title_en" placeholder="Title (English)" value={form.title_en} onChange={handleChange} className="input" />
          <div className="flex gap-2">
            <input name="slug_hi" placeholder="slug_hi" value={form.slug_hi} onChange={handleChange} className="input flex-1" />
            <button type="button" onClick={()=>autoSlug("hi")} className="px-3 bg-gray-200 rounded">Auto</button>
          </div>
          <div className="flex gap-2">
            <input name="slug_en" placeholder="slug_en" value={form.slug_en} onChange={handleChange} className="input flex-1" />
            <button type="button" onClick={()=>autoSlug("en")} className="px-3 bg-gray-200 rounded">Auto</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input name="category_hi" placeholder="Category (हिंदी)" value={form.category_hi} onChange={handleChange} className="input" />
          <input name="category_en" placeholder="Category (English)" value={form.category_en} onChange={handleChange} className="input" />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <textarea name="excerpt_hi" placeholder="Excerpt (हिंदी)" value={form.excerpt_hi} onChange={handleChange} className="input" />
          <textarea name="excerpt_en" placeholder="Excerpt (English)" value={form.excerpt_en} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description (हिंदी)</label>
          <div className="border p-2 rounded">
            <QuillEditor ref={editorHiRef} initialValue={[]} modules={modules} placeholder="हिंदी विवरण..." />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description (English)</label>
          <div className="border p-2 rounded">
            <QuillEditor ref={editorEnRef} initialValue={[]} modules={modules} placeholder="English description..." />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input name="image" placeholder="Featured image URL" value={form.image} onChange={handleChange} className="input" />
          <input name="tags" placeholder="tags, comma separated" value={form.tags} onChange={handleChange} className="input" />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} /> Trending
          </label>

          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={()=>setPreviewModeHi(p=>!p)} className="px-3 py-1 bg-gray-200 rounded">{previewModeHi ? "Hide Preview" : "Live Preview"}</button>
            <button type="button" onClick={()=>setPreviewModeEn(p=>!p)} className="px-3 py-1 bg-gray-200 rounded">{previewModeEn ? "Hide Preview" : "Live Preview"}</button>

            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Publish</button>
          </div>
        </div>
      </form>

      {/* LIVE PREVIEW */}
      {previewModeHi && (
        <div className="mt-8 p-4 border rounded">
          {form.image && <img src={form.image} alt="" className="w-full h-60 object-cover rounded mb-4" />}
          <h2 className="text-2xl font-bold">{form.title_hi}</h2>
          <p className="text-gray-600">{ form.excerpt_hi}</p>

          <div className="prose mt-4">
            <div dangerouslySetInnerHTML={{ __html:currentDescriptionHi }} />
          </div>
        </div>
      )}
      {previewModeEn && (
        <div className="mt-8 p-4 border rounded">
          {form.image && <img src={form.image} alt="" className="w-full h-60 object-cover rounded mb-4" />}
          <h2 className="text-2xl font-bold">{form.title_en }</h2>
          <p className="text-gray-600">{form.excerpt_en }</p>

          <div className="prose mt-4">
            <div dangerouslySetInnerHTML={{ __html: currentDescriptionEn }} />
          </div>
        </div>
      )}

      <style>{`
        .input { padding:8px; border:1px solid #e5e7eb; border-radius:6px }
      `}</style>
    </div>
  );
}
