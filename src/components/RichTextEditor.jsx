// components/QuillEditor.jsx
"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import "quill/dist/quill.snow.css";

const QuillEditor = forwardRef(function QuillEditor({ initialValue, modules = {}, placeholder }, ref) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!editorRef.current || quillRef.current) return;
      const Quill = (await import("quill")).default;
      if (!mounted) return;
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules,
        placeholder,
      });
      if (initialValue) {
        try {
          if (Array.isArray(initialValue) || initialValue.ops) {
            quillRef.current.setContents(initialValue);
          } else if (typeof initialValue === "string") {
            quillRef.current.root.innerHTML = initialValue;
          }
        } catch (e) { console.warn(e); }
      }
    }
    init();
    return () => { mounted = false; /* keep quillRef to avoid double init in strict mode */ };
  }, [initialValue, modules, placeholder]);

  useImperativeHandle(ref, () => ({
    getHTML: () => quillRef.current?.root?.innerHTML || "",
    getDelta: () => quillRef.current?.getContents?.() || null,
    setDelta: (d) => quillRef.current?.setContents?.(d),
  }), []);

  return <div ref={editorRef} className="min-h-[180px] bg-white" />;
});

export default QuillEditor;
