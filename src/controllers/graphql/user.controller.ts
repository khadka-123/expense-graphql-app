import bcrypt from "bcryptjs";
import userModel from "../../model/user.model.js";
import AppError from "../../error/app.error.js";
import { generateToken } from "../../utils/auth.user.js";

/**
 * Input type for register mutation
 */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Input type for Login mutation
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Input type for reset password
 */
export interface ResetPasswordInput {
  email: string;
  oldPassword: string;
  newPassword: string;
}

/**
 * Input type for email change
 */
export interface ChangeEmailInput {
  currentPassword: string;
  newEmail: string;
}

/**
 * Register a new user
 * @param _ - Unused resolver param
 * @param args - Input args with RegisterInput shape
 * @returns Message string if successful
 * @throws AppError if user already exists
 */
const register = async (
  _: unknown,
  args: { input: RegisterInput }
): Promise<{ message: string }> => {
  const { name, email, password } = args.input;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await userModel.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("User already Exist", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });
  await newUser.save();
  return { message: "New User Created" };
};

/**
 * Login an existing user
 * @param _ - Unused resolver param
 * @param args - Input args with LoginInput shape
 * @returns User ID & JWT token if successful
 * @throws AppError if credentials are invalid
 */
const login = async (
  _: unknown,
  args: { input: LoginInput }
): Promise<{ userId: string; token: string }> => {
  const { email, password } = args.input;
  const normalizedEmail = email.toLowerCase();

  const user = await userModel.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  return { userId: user._id.toString(), token };
};

/**
 * Logout user
 * For stateless JWT auth, this is mostly a client-side operation.
 * The client deletes the token from localstorage or cookies
 */
const logout = async (): Promise<{ message: string }> => {
  return { message: "User logout out successfully" };
};

/**
 * Reset the password for an existing user
 * @throws AppError if user not found or old password does not match
 */
const resetPassword = async (
  _: unknown,
  args: { input: ResetPasswordInput }
) => {
  const { email, oldPassword, newPassword } = args.input;
  const normalizedEmail = email.toLowerCase();

  const user = await userModel.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError("Old password is incorrect", 401);
  }

  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters", 400);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  return { message: "Password updated successfully" };
};

/**
 * Change the user's email.
 * @throws AppError if user not found, password incorrect, or email taken.
 */
const changeEmail = async (
  _: unknown,
  args: { userId: string; input: ChangeEmailInput }
): Promise<{ message: string }> => {
  const { userId, input } = args;
  const { currentPassword, newEmail } = input;

  const normalizedEmail = newEmail.toLowerCase();

  const user = await userModel.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new AppError("Incorrect password", 401);

  // Check if the new email is already taken
  const existing = await userModel.findOne({ email: normalizedEmail });
  if (existing) throw new AppError("Email already in use", 409);

  user.email = normalizedEmail;
  await user.save();

  return { message: "Email updated successfully" };
};

/**
 * Get account information for a user
 */
const getAccountInformation = async (
  _: unknown,
  args: { userId: string }
): Promise<{ name: string; email: string }> => {
  const { userId } = args;

  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    name: user.name,
    email: user.email,
  };
};

export {
  register,
  login,
  logout,
  resetPassword,
  changeEmail,
  getAccountInformation,
};
