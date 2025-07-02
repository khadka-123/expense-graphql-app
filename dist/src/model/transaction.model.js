import mongoose from "mongoose";
const TransactionSchema = new mongoose.Schema({
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
}, { timestamps: true });
const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
