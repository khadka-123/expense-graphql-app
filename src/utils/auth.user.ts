import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;

interface JwtPayload {
    userId: string;
    email: string;
}

const verifyToken = (token: string): JwtPayload | null => {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, secret);
        return decoded as JwtPayload;
    } catch {
        return null;
    }
}

const generateToken = (payload: JwtPayload): string => {

    return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export { generateToken, verifyToken }