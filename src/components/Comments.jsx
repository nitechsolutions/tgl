"use client";

export default function Comments({ comments }) {
  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">Comments</h3>

      {/* Write a comment box */}
      <div className="bg-gray-50 dark:bg-gray-100 p-4 rounded-lg mb-6">
        <textarea
          name="comment"
          className="w-full h-28 p-3 border rounded-lg bg-white dark:bg-gray-100 dark:text-gray-600 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          placeholder="Write a comment..."
        ></textarea>

        <button className="mt-3 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition">
          Send
        </button>
      </div>

      {/* List of existing comments */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c._id}
            className="bg-gray-100 dark:bg-gray-100 p-4 rounded-lg border border-gray-200 dark:border-gray-200"
          >
            <h4 className="font-semibold text-gray-900 dark:text-gray-900">
              {c.username}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-600 mt-1">
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
