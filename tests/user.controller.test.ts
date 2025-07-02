import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import bcrypt from "bcryptjs";
import * as authUtils from "../src/utils/auth.user.js";
import userModel from "../src/model/user.model.js";
import AppError from "../src/error/app.error.js";
import {
  register,
  login,
  resetPassword,
  changeEmail,
  getAccountInformation,
} from "../src/controllers/graphql/user.controller.js";

//mock dependencies
vi.mock("bcryptjs");
vi.mock("../src/model/user.model.js");
vi.mock("../src/utils/auth.user.js");

describe("User Controller (GraphQL)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //groups all test for register resolver
  describe("register()", () => {
    it("should throw if user already exists", async () => {
      vi.spyOn(userModel, "findOne").mockResolvedValue({} as any);

      await expect(
        register(null, {
          input: { name: "A", email: "a@b.com", password: "P@ssw0rd" },
        })
      ).rejects.toBeInstanceOf(AppError);
    });

    it("should create and save a new user", async () => {
      vi.spyOn(userModel, "findOne").mockResolvedValue(null);
      // mock bcrypt.hash
      (bcrypt.hash as any).mockResolvedValue("hashed");
      // spy on save()
      const saveSpy = vi
        .spyOn(userModel.prototype, "save")
        .mockResolvedValue(undefined);

      const result = await register(null, {
        input: { name: "A", email: "a@b.com", password: "P@ssw0rd" },
      });
      expect(saveSpy).toHaveBeenCalled();
      expect(result).toEqual({ message: "New User Created" });
    });
  });

  describe("login()", () => {
    it("should throw if email not found", async () => {
      vi.spyOn(userModel, "findOne").mockResolvedValue(null);
      await expect(
        login(null, { input: { email: "x@x.com", password: "whatever" } })
      ).rejects.toBeInstanceOf(AppError);
    });

    it("should throw if password mismatch", async () => {
      vi.spyOn(userModel, "findOne").mockResolvedValue({
        password: "hash",
      } as any);
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(
        login(null, { input: { email: "x@x.com", password: "bad" } })
      ).rejects.toBeInstanceOf(AppError);
    });

    it("should return userId and token on success", async () => {
      const fakeUser = {
        _id: "id123",
        email: "x@x.com",
        password: "hash",
      } as any;
      vi.spyOn(userModel, "findOne").mockResolvedValue(fakeUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      vi.spyOn(authUtils, "generateToken").mockReturnValue("token123");

      const { userId, token } = await login(null, {
        input: { email: "x@x.com", password: "good" },
      });
      expect(userId).toEqual("id123");
      expect(token).toEqual("token123");
    });
  });

  describe("resetPassword()", () => {
    it("should throw if user not found", async () => {
      vi.spyOn(userModel, "findOne").mockResolvedValue(null);
      await expect(
        resetPassword(null, {
          input: {
            email: "a@b.com",
            oldPassword: "old",
            newPassword: "newPass",
          },
        })
      ).rejects.toBeInstanceOf(AppError);
    });

    it("should throw if oldPassword mismatch", async () => {
      vi.spyOn(userModel, "findOne").mockResolvedValue({
        password: "hash",
      } as any);
      (bcrypt.compare as any).mockResolvedValue(false);
      await expect(
        resetPassword(null, {
          input: {
            email: "a@b.com",
            oldPassword: "wrong",
            newPassword: "newPass",
          },
        })
      ).rejects.toBeInstanceOf(AppError);
    });

    it("should update password on success", async () => {
      const fakeUser: any = {
        password: "hash",
        save: vi.fn().mockResolvedValue(undefined),
      };
      vi.spyOn(userModel, "findOne").mockResolvedValue(fakeUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      (bcrypt.hash as any).mockResolvedValue("newHash");

      const result = await resetPassword(null, {
        input: { email: "a@b.com", oldPassword: "old", newPassword: "newPass" },
      });
      expect(fakeUser.password).toEqual("newHash");
      expect(fakeUser.save).toHaveBeenCalled();
      expect(result).toEqual({ message: "Password updated successfully" });
    });
  });

  describe("changeEmail()", () => {
    it("should throw if user not found", async () => {
      vi.spyOn(userModel, "findById").mockResolvedValue(null);
      await expect(
        changeEmail(null, {
          userId: "u1",
          input: { currentPassword: "p", newEmail: "n@e.com" },
        })
      ).rejects.toBeInstanceOf(AppError);
    });

    it("should throw if password incorrect", async () => {
      const fakeUser: any = { password: "hash" };
      vi.spyOn(userModel, "findById").mockResolvedValue(fakeUser);
      (bcrypt.compare as any).mockResolvedValue(false);
      await expect(
        changeEmail(null, {
          userId: "u1",
          input: { currentPassword: "wrong", newEmail: "n@e.com" },
        })
      ).rejects.toBeInstanceOf(AppError);
    });

    it("should update email if valid", async () => {
      const fakeUser: any = {
        password: "hash",
        save: vi.fn().mockResolvedValue(undefined),
      };
      vi.spyOn(userModel, "findById").mockResolvedValue(fakeUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      vi.spyOn(userModel, "findOne").mockResolvedValue(null);

      const result = await changeEmail(null, {
        userId: "u1",
        input: { currentPassword: "p", newEmail: "N@E.COM" },
      });
      expect(fakeUser.email).toEqual("n@e.com");
      expect(fakeUser.save).toHaveBeenCalled();
      expect(result).toEqual({ message: "Email updated successfully" });
    });
  });

  describe("getAccountInformation()", () => {
    it("should throw if user not found", async () => {
      vi.spyOn(userModel, "findById").mockResolvedValue(null);
      await expect(
        getAccountInformation(null, { userId: "u1" })
      ).rejects.toBeInstanceOf(AppError);
    });

    it("should return name and email", async () => {
      const fakeUser = { name: "Test", email: "t@e.com" } as any;
      vi.spyOn(userModel, "findById").mockResolvedValue(fakeUser);
      const info = await getAccountInformation(null, { userId: "u1" });
      expect(info).toEqual({ name: "Test", email: "t@e.com" });
    });
  });
});
