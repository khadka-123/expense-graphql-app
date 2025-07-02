import { ApolloServer, BaseContext } from "@apollo/server";
import resolvers from "../module/resolver.js";
import typeDefs from "../module/schema.js";

/**
 * ApolloServer instance for GraphQL API
 */

const apolloServer = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
});

export default apolloServer;
