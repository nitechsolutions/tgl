export async function POST() {
  return Response.json(
    { message: "Logged out" },
    {
      status: 200,
      headers: {
        "Set-Cookie": `token=; Path=/; HttpOnly; Max-Age=0`,
      },
    }
  );
}
