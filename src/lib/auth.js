import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = (password) => bcrypt.hash(password, 10);

export const comparePassword = (plain, hashed) =>
  bcrypt.compare(plain, hashed);

export const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token) => {
  const user =  jwt.verify(token, process.env.JWT_SECRET);
  return user
}

export const getAuthToken = (req) => {
  const header = req.headers.get("authorization") || "";
  const parts = header.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") return parts[1];
  return null;
};
