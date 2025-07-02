import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;
if (!secret)
    throw new Error("JWT_SECRET is not defined in environment variables.");
/**
 * Verify a JWT and return its payload or null
 */
const verifyToken = (token) => {
    if (!token)
        return null;
    try {
        return jwt.verify(token, secret);
    }
    catch {
        return null;
    }
};
/**
 * Generate a JWT that expires in 1 hour
 */
const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
};
export { generateToken, verifyToken };
