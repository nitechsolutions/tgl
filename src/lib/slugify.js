export function slugifyHindi(text) {
  return text
    .trim()
    .replace(/[^\u0900-\u097F0-9a-zA-Z]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function slugifyEnglish(text) {
  return text
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