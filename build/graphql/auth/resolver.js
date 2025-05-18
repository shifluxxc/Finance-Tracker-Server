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
exports.resolvers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../../models/User");
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
exports.resolvers = {
    Mutation: {
        register: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name, email, password }) {
            const existingUser = yield User_1.User.findOne({ email });
            if (existingUser)
                throw new Error('User already exists');
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = yield User_1.User.create({ name, email, password: hashedPassword });
            const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
            return { token, user };
        }),
        login: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email, password }) {
            const user = yield User_1.User.findOne({ email });
            if (!user)
                throw new Error('Invalid credentials');
            const valid = yield bcryptjs_1.default.compare(password, user.password);
            if (!valid)
                throw new Error('Invalid credentials');
            const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
            return { token, user };
        }),
    },
};
