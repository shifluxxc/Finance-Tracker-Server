import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { transaction } from "./transactions";
import { budget } from "./budget";
import { auth } from "./auth";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const InitGraphqlServer = async () => {
  const PORT = Number(process.env.PORT) || 8000;

  const gqlserver = new ApolloServer({
    typeDefs: `
      ${transaction.typedefs}
      ${transaction.mutations}
      ${transaction.queries}
      ${budget.typedefs}
      ${budget.mutations}
      ${budget.queries}
      ${auth.typedefs}
      ${auth.mutations}`,
    resolvers: {
      Query: {
        ...transaction.resolvers.Query,
        ...budget.resolvers.Query,
      },
      Mutation: {
        ...transaction.resolvers.Mutation,
        ...budget.resolvers.Mutation, 
        ...auth.resolvers.Mutation,
      },
    },
  });

  await gqlserver.start();

  const app = express();

  // Configure CORS
  app.use(
    cors({
      origin: ["https://clientfinancetracker.vercel.app" , "http://localhost:8080"],
    })
  );

  // Add body parser middleware before Apollo Server middleware
     app.use(express.json());


  // Attach Apollo Server middleware
  app.use(
    "/graphql",
    expressMiddleware(gqlserver, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || ""; 
        if (authHeader.startsWith("Bearer "))
        {
          // console.log("Authorization header:", authHeader); // Log the authorization header for debugging
          const token = authHeader.split(" ")[1];
          // console.log("Token:", token); // Log the token for debugging
          try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            // console.log("Decoded JWT:", decoded); // Log the decoded JWT for debugging
            const user = await User.findById(decoded.id);
            if (user) {
              return { user };
            }
          } catch (err) {
            // console.error("JWT error:", err);
          }
        }
        return {};
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};
