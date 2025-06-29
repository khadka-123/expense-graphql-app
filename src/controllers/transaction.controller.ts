import transactionModel from '../model/transaction.model.js'
import catchAsync from '../error/catch.async.js'
import AppError from '../error/app.error.js'

const getTransaction = catchAsync(async (_: any, args: { userId: string }) => {

    const transactions = await transactionModel.find({
        userId: args.userId
    })
    return transactions;
})

const addTransaction = catchAsync(async (_: any, args: { userId: string; input: any }) => {
    const { userId, input } = args;
    const newTransaction = new transactionModel({ userId, ...input });
    await newTransaction.save();

    return {
        transactionId: newTransaction._id
    }
})

const updateTransaction = catchAsync(async (_: any, args: { userId: string; transactionId: string; input: any }) => {
    const { userId, transactionId, input } = args;
    const updated = await transactionModel.findOneAndUpdate(
        { _id: transactionId, userId }, //filter
        input  //update
    )
    if (!updated) throw new AppError('Transaction not found', 404);
    return { message: "Updated Successful" }
})

const deleteTransaction = catchAsync(async (_: any, args: { userId: string, transactionId: string }) => {

    const { userId, transactionId } = args;
    const deleted = await transactionModel.findOneAndDelete({
        _id: transactionId,
        userId: userId
    })
    if (!deleted) throw new AppError('Transaction not found', 404);
    return { message: "Transaction Deleted" }
})

export { getTransaction, addTransaction, updateTransaction, deleteTransaction };