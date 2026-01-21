import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import Horoscope from "@/models/horoscope";

export async function POST(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = verifyToken(token);
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { zodiac, content_hi, date } = await req.json();

  if (!zodiac || !content_hi) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const today = date || new Date().toISOString().split("T")[0];

  const horoscope = await Horoscope.findOneAndUpdate(
    { zodiac, date: today },
    { content_hi },
    { upsert: true, new: true }
  );

  return NextResponse.json({
    message: "Horoscope saved",
    horoscope,
  });
}

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const zodiac = searchParams.get("zodiac");
  const date =
    searchParams.get("date") ||
    new Date().toISOString().split("T")[0];

  if (!zodiac) {
    return NextResponse.json(
      { error: "zodiac required" },
      { status: 400 }
    );
  }

  const horoscope = await Horoscope.findOne({ zodiac, date });

  return NextResponse.json(horoscope || null);
}
