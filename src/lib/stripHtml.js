// lib/stripHtml.js
export function stripHtml(html = "") {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]*>?/gm, "");
  }

  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
