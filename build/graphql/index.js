"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitGraphqlServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const transactions_1 = require("./transactions");
const budget_1 = require("./budget");
const InitGraphqlServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = Number(process.env.PORT) || 8000;
    const gqlserver = new server_1.ApolloServer({
        typeDefs: `
      ${transactions_1.transaction.typedefs}
      ${transactions_1.transaction.mutations}
      ${transactions_1.transaction.queries}
      ${budget_1.budget.typedefs}
      ${budget_1.budget.mutations}
      ${budget_1.budget.queries}
    `,
        resolvers: {
            Query: Object.assign(Object.assign({}, transactions_1.transaction.resolvers.Query), budget_1.budget.resolvers.Query),
            Mutation: Object.assign(Object.assign({}, transactions_1.transaction.resolvers.Mutation), budget_1.budget.resolvers.Mutation),
        },
    });
    yield gqlserver.start();
    const app = (0, express_1.default)();
    // Configure CORS
    app.use((0, cors_1.default)({
        origin: ["https://clientfinancetracker.vercel.app"],
    }));
    // Add body parser middleware
    app.use(body_parser_1.default.json());
    // Attach Apollo Server middleware
    app.use("/graphql", (0, express4_1.expressMiddleware)(gqlserver));
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
});
exports.InitGraphqlServer = InitGraphqlServer;
