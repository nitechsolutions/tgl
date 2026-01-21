import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  await connectDB();
  try {
    const { name, email, password } = await req.json();

    if (!email || !password)
      return Response.json({ error: "Email & Password required" }, { status: 400 });

    const exists = await User.findOne({ email });
    if (exists)
      return Response.json({ error: "User already exists" }, { status: 400 });

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "reader",
    });

    return Response.json({ message: "Registered", user });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
