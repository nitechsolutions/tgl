import { comparePassword, signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return Response.json({ error: "Invalid email or password" }, { status: 400 });

    const match = await comparePassword(password, user.password);
    if (!match)
      return Response.json({ error: "Invalid email or password" }, { status: 400 });

    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // ⭐ FIXED: HttpOnly Cookie set correctly
    const res = Response.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      }
    });

    res.headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );

    return res;

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
