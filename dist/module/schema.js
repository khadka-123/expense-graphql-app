import { gql } from 'graphql-tag';
const typeDefs = gql `

scalar Date

type Message{
    message:String!
}

type AuthPayload{
    userId:ID!
    token:String!
}

type Transaction{
    _id:ID!
    userId:ID!
    amount:Float!
    type:String!
    category:String!
    reference:String
    description:String!
    date:Date!
}

input TransactionInput{
    amount:Float!
    type:String!
    category:String!
    reference:String
    description:String!
    date:Date!
}

input RegisterInput{
    name:String!
    email:String!
    password:String!
}
input LoginInput{
    email:String!
    password:String!
}

type Query{
    getTransaction(userId:ID!):[Transaction!]!
}

type TransactionId{
    transactionId:ID!
}

type Mutation{
    addTransaction(userId:ID!,input:TransactionInput!):TransactionId!
    updateTransaction(userId:ID!,transactionId:ID!,input:TransactionInput!):Message!
    deleteTransaction(userId:ID!,transactionId:ID!):Message!
    register(input:RegisterInput!):Message!
    login(input:LoginInput!):AuthPayload!
    # login(email: String!, password: String!): User!
}
`;
export default typeDefs;
