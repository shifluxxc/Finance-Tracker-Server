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
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction_1 = require("../../models/Transaction");
exports.resolvers = {
    Query: {
        transactions: () => __awaiter(void 0, void 0, void 0, function* () {
            const transactions = yield Transaction_1.Transaction.find().populate('category');
            return transactions.filter(transaction => transaction.category);
        }),
        monthWiseExpenses: () => __awaiter(void 0, void 0, void 0, function* () {
            const results = yield Transaction_1.Transaction.aggregate([
                {
                    $group: {
                        _id: {
                            year: '$year',
                            month: '$month',
                        },
                        total: { $sum: '$amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [
                                { $toString: '$_id.year' },
                                '-',
                                {
                                    $cond: [
                                        { $lt: ['$_id.month', 10] },
                                        { $concat: ['0', { $toString: '$_id.month' }] },
                                        { $toString: '$_id.month' },
                                    ],
                                },
                            ],
                        },
                        total: 1,
                    },
                },
                { $sort: { month: 1 } },
            ]);
            return results;
        }),
        categoryExpensePercentage: () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const totalAmountAgg = yield Transaction_1.Transaction.aggregate([
                { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
            ]);
            const totalAmount = ((_a = totalAmountAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            const categoryAgg = yield Transaction_1.Transaction.aggregate([
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: { $abs: '$amount' } },
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'categoryInfo',
                    },
                },
                {
                    $unwind: '$categoryInfo',
                },
                {
                    $project: {
                        category: '$categoryInfo.name',
                        percentage: {
                            $round: [
                                {
                                    $multiply: [{ $divide: ['$total', totalAmount] }, 100]
                                },
                                1 // round to 1 decimal place
                            ]
                        },
                    },
                },
                { $sort: { percentage: -1 } },
            ]);
            return categoryAgg;
        }),
    },
    Mutation: {
        addTransaction: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { amount, description, categoryId, }) {
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            const transaction = new Transaction_1.Transaction({
                amount,
                description,
                month: currentMonth,
                year: currentYear,
                category: categoryId,
            });
            yield transaction.save();
            return transaction.populate('category');
        }),
        editTransaction: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id, amount, description, categoryId, }) {
            var _b, _c;
            const transaction = yield Transaction_1.Transaction.findById(id);
            if (!transaction)
                throw new Error('Transaction not found');
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            transaction.amount = amount !== null && amount !== void 0 ? amount : transaction.amount;
            transaction.description = description !== null && description !== void 0 ? description : transaction.description;
            transaction.month = (_b = transaction.month) !== null && _b !== void 0 ? _b : currentMonth;
            transaction.year = (_c = transaction.year) !== null && _c !== void 0 ? _c : currentYear;
            if (categoryId) {
                try {
                    transaction.category = new mongoose_1.default.Types.ObjectId(categoryId);
                }
                catch (error) {
                    throw new Error('Invalid category ID');
                }
            }
            yield transaction.save();
            return transaction.populate('category');
        }),
        deleteTransaction: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const deleted = yield Transaction_1.Transaction.findByIdAndDelete(id);
            if (!deleted)
                throw new Error('Transaction not found');
            return 'Transaction deleted successfully';
        }),
    },
    Transaction: {
        id: (parent) => parent._id.toString(),
    },
    Category: {
        id: (parent) => parent._id.toString(),
    },
};
