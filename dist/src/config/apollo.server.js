import { ApolloServer } from "@apollo/server";
import resolvers from "../module/resolver.js";
import typeDefs from "../module/schema.js";
/**
 * ApolloServer instance for GraphQL API
 */
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});
export default apolloServer;
