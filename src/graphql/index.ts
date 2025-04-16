import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import express from "express";
import { startStandaloneServer } from "@apollo/server/standalone";
import { json } from "body-parser";
import { transaction } from "./transactions";
import { budget } from "./budget";
import cors from "cors";
const allowedOrigins = ['https://clientfinancetracker.vercel.app'];


export const InitGraphqlServer = async () => {
    const app = express(); 
    const PORT = Number(process.env.PORT) || 8000; 
    app.use(json()); 

    app.use(cors({
        origin: allowedOrigins,
        credentials: true,
      }));
      
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
                ...budget.resolvers.Query
            },
            Mutation: {
                ...transaction.resolvers.Mutation, 
                ...budget.resolvers.Mutation 
            }
        }, 
    });

    const { url } = await startStandaloneServer(gqlserver, {
        listen: { port: PORT},
      });

    return url; 
};
