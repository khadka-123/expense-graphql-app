import { ApolloServer } from '@apollo/server';
import resolvers from '../module/resolvers.js';
import typeDefs from '../module/schema.js';
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});
export default apolloServer;
