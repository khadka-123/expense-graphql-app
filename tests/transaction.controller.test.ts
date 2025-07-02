import { describe, it, expect, vi, beforeEach } from "vitest";
import transactionModel from "../src/model/transaction.model.js";
import AppError from "../src/error/app.error.js";
import {
  getTransaction,
  addTransaction,
  updateTransaction,
  softUpdateTransaction,
  deleteTransaction,
} from "../src/controllers/graphql/transaction.controller.js";

vi.mock("../src/model/transaction.model.js");

describe("Transaction Controller (GraphQL)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTransaction()", () => {
    it("returns an array of transactions", async () => {
      const fakeTxs = [{ amount: 10 }, { amount: 20 }] as any;
      (transactionModel.find as any).mockResolvedValue(fakeTxs);

      const result = await getTransaction(null, { userId: "u1" });
      expect(result).toBe(fakeTxs);
    });

    it("throws on DB error", async () => {
      (transactionModel.find as any).mockRejectedValue(new Error("DB fail"));
      await expect(
        getTransaction(null, { userId: "u1" })
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  describe("addTransaction()", () => {
    it("saves and returns new ID", async () => {
      vi.spyOn(transactionModel.prototype, "save").mockResolvedValue(undefined);
      Object.defineProperty(transactionModel.prototype, "_id", {
        get: () => "abc",
      });

      const result = await addTransaction(null, {
        userId: "u1",
        input: {
          amount: 5,
          type: "A",
          category: "C",
          description: "D",
          date: new Date(),
        },
      });
      expect(result).toEqual({ transactionId: "abc" });
    });

    it("throws on save error", async () => {
      vi.spyOn(transactionModel.prototype, "save").mockRejectedValue(
        new Error("fail")
      );
      await expect(
        addTransaction(null, {
          userId: "u1",
          input: {
            amount: 5,
            type: "A",
            category: "C",
            description: "D",
            date: new Date(),
          },
        })
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  describe("updateTransaction()", () => {
    it("updates successfully", async () => {
      (transactionModel.findOneAndUpdate as any).mockResolvedValue({} as any);
      const res = await updateTransaction(null, {
        userId: "u1",
        transactionId: "t1",
        input: { amount: 7 },
      });
      expect(res).toEqual({ message: "Updated Successful" });
    });

    it("throws if not found", async () => {
      (transactionModel.findOneAndUpdate as any).mockResolvedValue(null);
      await expect(
        updateTransaction(null, {
          userId: "u1",
          transactionId: "t1",
          input: {},
        })
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  describe("softUpdateTransaction()", () => {
    it("marks old inactive and inserts new", async () => {
      // Old document stub
      const oldDoc: any = {
        status: "Active",
        userId: "u1",
        amount: 1,
        type: "T",
        category: "C",
        reference: "",
        description: "D",
        date: new Date(),
        save: vi.fn().mockResolvedValue(undefined),
      };
      vi.spyOn(transactionModel, "findOne").mockResolvedValue(oldDoc);

      vi.spyOn(transactionModel.prototype, "save").mockResolvedValue(undefined);
      Object.defineProperty(transactionModel.prototype, "_id", {
        get: () => "new",
      });

      const res = await softUpdateTransaction(null, {
        userId: "u1",
        transactionId: "t1",
        input: { amount: 2, comments: "reason" },
      });
      expect(oldDoc.save).toHaveBeenCalled();
      expect(res).toEqual({
        message: "Transaction updated with versioning and comment",
      });
    });

    it("throws if no active found", async () => {
      vi.spyOn(transactionModel, "findOne").mockResolvedValue(null);
      await expect(
        softUpdateTransaction(null, {
          userId: "u1",
          transactionId: "t1",
          input: {},
        })
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  describe("deleteTransaction()", () => {
    it("deletes successfully", async () => {
      (transactionModel.findOneAndDelete as any).mockResolvedValue({} as any);
      const res = await deleteTransaction(null, {
        userId: "u1",
        transactionId: "t1",
      });
      expect(res).toEqual({ message: "Transaction Deleted" });
    });

    it("throws if not found", async () => {
      (transactionModel.findOneAndDelete as any).mockResolvedValue(null);
      await expect(
        deleteTransaction(null, {
          userId: "u1",
          transactionId: "t1",
        })
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
