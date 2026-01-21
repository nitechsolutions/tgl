export default function Unauthorized() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="mt-3 text-gray-700">
        You don't have permission to access this page.
      </p>
      <a href="/" className="mt-5 inline-block text-blue-600 underline">Go Home</a>
    </div>
  );
}
