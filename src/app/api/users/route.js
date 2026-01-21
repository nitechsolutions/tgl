import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromCookies } from "@/lib/getUserFromRequest";

export async function GET(req) {
  await connectDB();

  const user = getUserFromCookies(req);
  if (!user || user.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const users = await User.find().select("-password");
  return Response.json(users);
}
