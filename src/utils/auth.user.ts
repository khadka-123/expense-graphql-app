import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

if (!secret)
  throw new Error("JWT_SECRET is not defined in environment variables.");

interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Verify a JWT and return its payload or null
 */
const verifyToken = (token: string): JwtPayload | null => {
  if (!token) return null;
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Generate a JWT that expires in 1 hour
 */
const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

export { generateToken, verifyToken };
