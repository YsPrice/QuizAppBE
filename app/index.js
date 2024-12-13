const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const prisma = require('./utils/prisma');
const app = express();
const port = 3000;

const typeDefs = `
   type Query {
    healthCheck: String
   }`
;
const resolvers = {
    Query: {
      healthCheck: () => "Server is up and running!",
    },
  };
  const server = new ApolloServer({ typeDefs, resolvers });

  async function startServer(){
    await server.start();
    app.use('/graphql',express.json(),expressMiddleware(server));
    app.listen(4000, ()=>{
        console.log('Server is running at port 4000/graphql')
    })
  };
  startServer();