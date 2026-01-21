import { getUserFromCookies } from "@/lib/getUserFromRequest";

export async function GET(req) {
  const user = getUserFromCookies(req);  
  if (!user) return Response.json({ user: null }, { status: 401 });
  return Response.json(user);
}
