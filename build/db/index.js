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
exports.connectDB = void 0;
// src/db/index.ts
const mongoose_1 = __importDefault(require("mongoose"));
const Category_1 = require("../models/Category");
const categories = [
    'Food & Dining',
    'Housing',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Shopping',
    'HealthCare',
    'Personal',
    'Income',
];
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGODB_URI || (process.env.DOCKER ? 'mongodb://myuser:mypassword@mongo:27017/mydatabase?authSource=admin' : 'mongodb://myuser:mypassword@localhost:27017/mydatabase?authSource=admin'));
        console.log('MongoDB connected');
        for (const name of categories) {
            const exists = yield Category_1.Category.findOne({ name });
            if (!exists) {
                yield Category_1.Category.create({ name });
                //  console.log(`Inserted category: ${name}`);
            }
            else {
                //   console.log(`Category already exists: ${name}`);
            }
        }
    }
    catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
