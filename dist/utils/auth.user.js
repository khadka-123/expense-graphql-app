import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secret = process.env.JWT_SECRET;
const verifyToken = (token) => {
    if (!token)
        return null;
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    }
    catch {
        return null;
    }
};
const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};
export { generateToken, verifyToken };
