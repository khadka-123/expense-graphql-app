import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/,
            "Please use a valid email address",
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters"],
        match: [
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}$/,
            "Password must contain at least one uppercase, one lowercase, one number, and one special character",
        ],
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;
