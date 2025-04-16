import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { transaction } from "./transactions";
import { budget } from "./budget";

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
    `,
    resolvers: {
      Query: {
        ...transaction.resolvers.Query,
        ...budget.resolvers.Query,
      },
      Mutation: {
        ...transaction.resolvers.Mutation,
        ...budget.resolvers.Mutation,
      },
    },
  });

  await gqlserver.start();

  const app = express();

  // Configure CORS
  app.use(
    cors({
      origin: ["https://clientfinancetracker.vercel.app"],
    })
  );

  // Add body parser middleware
  app.use(bodyParser.json());

  // Attach Apollo Server middleware
  app.use("/graphql", expressMiddleware(gqlserver));

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};