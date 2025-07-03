import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import PDFDocument from "pdfkit";
import transactionModel from "../src/model/transaction.model.js";
import downloadTransaction from "../src/controllers/restful/transaction.controller.js";
import AppError from "../src/error/app.error.js";

// Mock PDFDocument pipe and end
vi.mock("pdfkit", () => {
  const actual = vi.importActual("pdfkit");
  return {
    default: vi.fn().mockImplementation(() => ({
      pipe: vi.fn(),
      fontSize: vi.fn().mockReturnThis(),
      text: vi.fn().mockReturnThis(),
      moveDown: vi.fn().mockReturnThis(),
      end: vi.fn(),
    })),
  };
});

describe("downloadTransaction", () => {
  const mockReq = {
    params: { userId: "123" },
  } as unknown as Request;

  const mockRes = {
    setHeader: vi.fn(),
    end: vi.fn(),
  } as unknown as Response;

  const next = vi.fn() as NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate PDF and send response", async () => {
    vi.spyOn(transactionModel, "find").mockResolvedValue([
      {
        amount: 100,
        type: "income",
        category: "salary",
        description: "Monthly pay",
        date: new Date(),
      },
    ]);

    await downloadTransaction(mockReq, mockRes, next);

    // Check headers
    expect(mockRes.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/pdf"
    );
    expect(mockRes.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      "attachment;filename=transactions.pdf"
    );

    // Check that PDFDocument methods are called
    const pdfDocMock = PDFDocument as unknown as any;
    expect(pdfDocMock).toHaveBeenCalled();
    const instance = pdfDocMock.mock.results[0].value;

    expect(instance.pipe).toHaveBeenCalledWith(mockRes);
    expect(instance.end).toHaveBeenCalled();

    // next should not be called
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with AppError if no userId", async () => {
    const req = { params: {} } as Request;
    await downloadTransaction(req, mockRes, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should call next with AppError if no transactions found", async () => {
    vi.spyOn(transactionModel, "find").mockResolvedValue([]);

    await downloadTransaction(mockReq, mockRes, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("should handle unexpected error", async () => {
    vi.spyOn(transactionModel, "find").mockRejectedValue(new Error("DB error"));

    await downloadTransaction(mockReq, mockRes, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Failed to download transaction",
      })
    );
  });
});
