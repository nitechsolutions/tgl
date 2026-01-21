export default function RelatedPost({ posts, currentSlug }) {
  const filtered = posts
    .filter((item) => item.slug_hi !== currentSlug) // remove current article
    .slice(0, 4);

  return (
    <div>
      {filtered.map((item) => (
        <a
          key={item._id}
          href={`/hi/post/${item.slug_hi}`}
          className="flex gap-3 mt-6 items-center"
        >
          <img
            src={item.image}
            className="w-20 h-20 object-cover rounded-md"
            alt={item.title_hi}
          />

          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">
              {item.title_hi?.slice(0, 50)}...
            </h3>

            <span
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{
                __html: `${item.description_hi?.substring(0, 70)}...`,
              }}
            />
          </div>
        </a>
      ))}
    </div>
  );
}
