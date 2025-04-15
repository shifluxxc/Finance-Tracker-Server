"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
// src/models/Transaction.ts
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionSchema = new mongoose_1.default.Schema({
    amount: { type: Number, required: true },
    description: { type: String },
    month: { type: Number, required: true }, // 1 = January, 12 = December
    year: { type: Number, required: true },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
}, { timestamps: true });
exports.Transaction = mongoose_1.default.model('Transaction', TransactionSchema);
