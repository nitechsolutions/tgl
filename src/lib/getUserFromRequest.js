import { verifyToken } from "./auth";

export function getUserFromCookies(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch (e) {
    return null;
  }
}
