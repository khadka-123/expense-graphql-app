import { ApolloServer, BaseContext } from '@apollo/server'
import resolvers from '../module/resolvers.js'
import typeDefs from '../module/schema.js'
const apolloServer = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers
})

export default apolloServer