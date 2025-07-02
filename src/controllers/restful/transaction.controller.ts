import express, { Request, Response,NextFunction } from "express";
import PDFDocument from "pdfkit";
import transactionModel from "../../model/transaction.model.js";
import AppError from "../../error/app.error.js"; 

/**
 * @returns a pdf with all the transactions of a user.
 */
const downloadTransaction = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const userId = req.params.userId as string;

    if (!userId) {
      return next(new AppError("Missing UserId", 400));
    }

    const transactions = await transactionModel.find({ userId });

    if (!transactions.length) {
      return next(new AppError("No transactions found", 404));
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment;filename=transactions.pdf"
    );

    doc.pipe(res);

    doc.fontSize(18).text("Your Transactions", { underline: true }).moveDown();

    transactions.forEach((txn) => {
      doc
        .fontSize(12)
        .text(`Amount: ${txn.amount}`)
        .text(`Type: ${txn.type}`)
        .text(`Category: ${txn.category}`)
        .text(`Description: ${txn.description}`)
        .text(`Date: ${txn.date.toISOString()}`)
        .moveDown();
    });

    doc.end();
  } catch (err) {
    next(new AppError('Failed to download transaction',500));
  }
};

export default downloadTransaction;
