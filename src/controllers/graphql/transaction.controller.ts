import transactionModel from "../../model/transaction.model.js";
import AppError from "../../error/app.error.js";

/**
 * Args for getting transactions
 */
interface GetTransactionArgs {
  userId: string;
}

/**
 * Get transactions in a date range for a user
 */
interface GetTransactionsInRangeArgs {
  userId: string;
  from: Date;
  to: Date;
  type?: string;
}

/**
 * Shape of a new transaction
 */
interface TransactionInput {
  amount: number;
  type: string;
  category: string;
  reference?: string;
  description: string;
  date: Date;
  comments?: string;
}

/**
 * Args for addTransaction mutation
 */
interface AddTransactionArgs {
  userId: string;
  input: TransactionInput;
}

/**
 * Args for updateTransaction mutation
 */
interface UpdateTransactionArgs {
  userId: string;
  transactionId: string;
  input: Partial<TransactionInput>;
}

/**
 * Args for deleteTransaction mutation
 */
interface DeleteTransactionArgs {
  userId: string;
  transactionId: string;
}

/**
 * Get all transactions for a user
 */
const getTransaction = async (
  _: unknown,
  args: GetTransactionArgs
): Promise<TransactionInput[]> => {
  try {
    const transactions = await transactionModel.find({ userId: args.userId });
    return transactions;
  } catch (err) {
    throw new AppError("Failed to get transactions", 500);
  }
};

const getTransactionsInRange = async (
  _: unknown,
  args: GetTransactionsInRangeArgs
) => {
  const { userId, from, to, type } = args;

  const query: any = {
    userId,
    date: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
  };

  if (type && type !== "all") {
    query.type = type;
  }

  const transactions = await transactionModel.find(query);

  if (!transactions.length) {
    throw new AppError("No transactions found for the given date range", 404);
  }

  return transactions;
};

/**
 * Add a new transaction
 */
const addTransaction = async (
  _: unknown,
  args: AddTransactionArgs
): Promise<{ transactionId: string }> => {
  try {
    const newTransaction = new transactionModel({
      userId: args.userId,
      ...args.input,
    });
    await newTransaction.save();

    return { transactionId: newTransaction._id.toString() };
  } catch (err) {
    throw new AppError("Failed to add transaction", 500);
  }
};

/**
 * Update an existing transaction
 */
const updateTransaction = async (
  _: unknown,
  args: UpdateTransactionArgs
): Promise<{ message: string }> => {
  try {
    const updated = await transactionModel.findOneAndUpdate(
      { _id: args.transactionId, userId: args.userId }, //filter
      args.input,
      { new: true }
    );
    if (!updated) throw new AppError("Transaction not found", 404);
    return { message: "Updated Successful" };
  } catch (error) {
    throw new AppError("Failed to update transaction", 500);
  }
};

/**
 * Soft update the transaction
 */
const softUpdateTransaction = async (
  _: unknown,
  args: UpdateTransactionArgs
): Promise<{ message: string }> => {
  const { userId, transactionId, input } = args;

  const existingTransaction = await transactionModel.findOne({
    _id: transactionId,
    userId: userId,
    status: "Active",
  });

  if (!existingTransaction) {
    throw new AppError("Transaction not found", 404);
  }

  // Mark old as Inactive
  existingTransaction.status = "Inactive";
  await existingTransaction.save();

  // Create
  const newTransaction = new transactionModel({
    userId: existingTransaction.userId,
    amount: input.amount ?? existingTransaction.amount,
    type: input.type ?? existingTransaction.type,
    category: input.category ?? existingTransaction.category,
    reference: input.reference ?? existingTransaction.reference,
    description: input.description ?? existingTransaction.description,
    date: input.date ?? existingTransaction.date,
    comments: input.comments ?? "No comment provided",
    status: "Active",
  });

  await newTransaction.save();

  return { message: "Transaction updated with versioning and comment" };
};

/**
 * Delete a transaction
 */
const deleteTransaction = async (
  _: unknown,
  args: DeleteTransactionArgs
): Promise<{ message: string }> => {
  try {
    const deleted = await transactionModel.findOneAndDelete({
      _id: args.transactionId,
      userId: args.userId,
    });
    if (!deleted) throw new AppError("Transaction not found", 404);
    return { message: "Transaction Deleted" };
  } catch (err) {
    throw new AppError("Failed to delete transaction", 500);
  }
};

export {
  getTransaction,
  addTransaction,
  updateTransaction,
  softUpdateTransaction,
  deleteTransaction,
  getTransactionsInRange,
};
