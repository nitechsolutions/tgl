import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromCookies } from "@/lib/getUserFromRequest";

export async function PUT(req, { params }) {
  await connectDB();
  const admin = getUserFromCookies(req);

  if (!admin || admin.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { role } = await req.json();

  const updated = await User.findByIdAndUpdate(
    params.id,
    { role },
    { new: true }
  );

  return Response.json(updated);
}
