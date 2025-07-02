import { gql } from "graphql-tag";
const typeDefs = gql `
  scalar Date

  type Message {
    message: String!
  }

  type AuthPayload {
    userId: ID!
    token: String!
  }

  type Transaction {
    _id: ID!
    userId: ID!
    amount: Float!
    type: String!
    category: String!
    reference: String
    description: String!
    date: Date!
  }

  input TransactionInput {
    amount: Float!
    type: String!
    category: String!
    reference: String
    description: String!
    date: Date!
    comments: String
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  input ResetPasswordInput {
    email: String!
    oldPassword: String!
    newPassword: String!
  }
  input ChangeEmailInput {
    currentPassword: String!
    newEmail: String!
  }


  type TransactionId {
    transactionId: ID!
  }

  type AccountInfo{
    name:String!
    email:String!
  }

  type Query {
    getTransaction(userId: ID!): [Transaction!]!
    getAccountInformation(userId:ID!):AccountInfo!
  }

  type Mutation {
    addTransaction(userId: ID!, input: TransactionInput!): TransactionId!
    updateTransaction(
      userId: ID!
      transactionId: ID!
      input: TransactionInput!
    ): Message!
    softUpdateTransaction(
      userId: ID!
      transactionId: ID!
      input: TransactionInput!
    ): Message!
    deleteTransaction(userId: ID!, transactionId: ID!): Message!
    register(input: RegisterInput!): Message!
    login(input: LoginInput!): AuthPayload!
    logout: Message!
    resetPassword(input: ResetPasswordInput): Message!
    changeEmail(userId: ID!, input: ChangeEmailInput!): Message!
  }
`;
export default typeDefs;
