const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require("cors");
require('dotenv').config();

const userSchema = require('./graphql/schemas/userSchema');
const questionSchema = require('./graphql/schemas/questionSchema');
const quizSchema = require('./graphql/schemas/quizSchema');
const optionSchema = require('./graphql/schemas/optionSchema');
const userResolver = require('./graphql/resolvers/userResolver');
const questionResolver = require('./graphql/resolvers/questionResolver');
const optionResolver = require('./graphql/resolvers/optionResolver');
const quizResolver = require('./graphql/resolvers/quizResolver');
const baseSchema = require('./graphql/schemas/baseSchema');
const { verifyToken } = require('./utils/jwtHelper');

const app = express();

const typeDefs = [baseSchema, userSchema, questionSchema, quizSchema, optionSchema];
const resolvers = [userResolver, questionResolver, quizResolver, optionResolver];

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    console.log("Context function triggered");
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    console.log("Authorization Header:", authHeader);

    if (!token) {
      console.log("No token provided");
      return { userId: null };
    }

    try {
      const payload = verifyToken(token);
      console.log("Decoded Payload:", payload);
      return { userId: payload.userId };
    } catch (err) {
      console.log("Invalid Token:", err.message);
      return { userId: null };
    }
  },
});

async function startServer() {
  await server.start();
  app.use(
    cors({
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"], 
      credentials: true, 
    })
  );
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        console.log("Request Headers:", req.headers);
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        console.log("Authorization Header (from middleware):", authHeader);

        if (!token) {
          console.log("No token provided in middleware");
          return { userId: null };
        }

        try {
          const payload = verifyToken(token);
          console.log("Decoded Payload (from middleware):", payload);
          return { userId: payload.userId };
        } catch (err) {
          console.log("Invalid Token (from middleware):", err.message);
          return { userId: null };
        }
      },
    })
  );

  app.listen(4000, () => {
    console.log('Server is running at port 4000/graphql');
  });
}
require('dotenv').config();
console.log(process.env.DATABASE_URL);
startServer();
