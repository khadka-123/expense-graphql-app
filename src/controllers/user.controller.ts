import bcrypt from 'bcryptjs';
import userModel from '../model/user.model.js'
import catchAsync from '../error/catch.async.js'
import AppError from '../error/app.error.js';
import { generateToken } from '../utils/auth.user.js';

const register = catchAsync(async (_: any, args: any) => {

    const { name, email, password } = args.input;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        throw new AppError("User already Exist", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save()
    return { message: "New User Created" };
})

const login = catchAsync(async (_: any, args: any) => {

    const { email, password } = args.input;

    const user = await userModel.findOne({ email });

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({ userId: user._id.toString(), email: user.email });

    return {
        userId: user._id,
        token
    };
})

export { register, login }