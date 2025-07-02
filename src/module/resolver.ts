import {
  getTransaction,
  addTransaction,
  updateTransaction,
  softUpdateTransaction,
  deleteTransaction,
} from "../controllers/graphql/transaction.controller.js";
import {
  register,
  login,
  logout,
  resetPassword,
  changeEmail,
  getAccountInformation,
} from "../controllers/graphql/user.controller.js";

/**
 * GraphQL resolvers:
 * Maps Query and Mutation operations to controller handlers.
 */

const resolvers = {
  Query: {
    getTransaction,
    getAccountInformation,
  },
  Mutation: {
    addTransaction,
    updateTransaction,
    softUpdateTransaction,
    deleteTransaction,
    register,
    login,
    logout,
    resetPassword,
    changeEmail,
  },
};

export default resolvers;
