import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export const config = {
  matcher: ["/dashboard/:path*"],
  runtime: "nodejs"   // ⭐ FORCE NODE RUNTIME
};

export function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();
  const path = url.pathname;

  let user = null;
  if (token) {
    try {
      user = verifyToken(token); 
    } catch (e) {
      console.log("Token Error:", e.message);
    }
  }

  // ⛔ Protected Routes
  if (path.startsWith("/dashboard") && !user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ⛔ Writer Routes
  if (path.startsWith("/dashboard/writer")) {
    if (!user || !["writer", "admin"].includes(user.role)) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // ⛔ Admin Routes
  if (path.startsWith("/dashboard/admin")) {
    if (!user || user.role !== "admin") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
