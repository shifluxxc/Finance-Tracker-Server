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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const transactions_1 = require("./transactions");
const budget_1 = require("./budget");
const auth_1 = require("./auth");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
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
      ${auth_1.auth.typedefs}
      ${auth_1.auth.mutations}`,
        resolvers: {
            Query: Object.assign(Object.assign({}, transactions_1.transaction.resolvers.Query), budget_1.budget.resolvers.Query),
            Mutation: Object.assign(Object.assign(Object.assign({}, transactions_1.transaction.resolvers.Mutation), budget_1.budget.resolvers.Mutation), auth_1.auth.resolvers.Mutation),
        },
    });
    yield gqlserver.start();
    const app = (0, express_1.default)();
    // Configure CORS
    app.use((0, cors_1.default)({
        origin: ["https://clientfinancetracker.vercel.app", "http://localhost:8080"],
    }));
    // Add body parser middleware before Apollo Server middleware
    app.use(express_1.default.json());
    // Attach Apollo Server middleware
    app.use("/graphql", (0, express4_1.expressMiddleware)(gqlserver, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
            const authHeader = req.headers.authorization || "";
            if (authHeader.startsWith("Bearer ")) {
                // console.log("Authorization header:", authHeader); // Log the authorization header for debugging
                const token = authHeader.split(" ")[1];
                // console.log("Token:", token); // Log the token for debugging
                try {
                    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                    // console.log("Decoded JWT:", decoded); // Log the decoded JWT for debugging
                    const user = yield User_1.User.findById(decoded.id);
                    if (user) {
                        return { user };
                    }
                }
                catch (err) {
                    // console.error("JWT error:", err);
                }
            }
            return {};
        }),
    }));
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
});
exports.InitGraphqlServer = InitGraphqlServer;
