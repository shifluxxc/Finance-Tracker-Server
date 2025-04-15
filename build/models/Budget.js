"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = void 0;
// src/models/Budget.ts
const mongoose_1 = __importDefault(require("mongoose"));
const BudgetSchema = new mongoose_1.default.Schema({
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    amount: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
}, { timestamps: true });
exports.Budget = mongoose_1.default.model('Budget', BudgetSchema);
