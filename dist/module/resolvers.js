import { getTransaction, addTransaction, updateTransaction, deleteTransaction } from '../controllers/transaction.controller.js';
import { register, login } from '../controllers/user.controller.js';
const resolvers = {
    Query: {
        getTransaction,
    },
    Mutation: {
        addTransaction,
        updateTransaction,
        deleteTransaction,
        register,
        login
    }
};
export default resolvers;
