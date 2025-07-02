import mongoose, { Document } from "mongoose";

/**
 * Transaction interface for type safety
 */
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: string;
  category: string;
  reference?: string;
  description: string;
  date: Date;
  status?: string;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    reference: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    comments: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);

export default Transaction;
