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
        transactions: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user)
                throw new Error('Not authenticated');
            const transactions = yield Transaction_1.Transaction.find({ user: context.user._id }).populate('category');
            return transactions.filter(transaction => transaction.category);
        }),
        monthWiseExpenses: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user)
                throw new Error('Not authenticated');
            const results = yield Transaction_1.Transaction.aggregate([
                { $match: { user: new mongoose_1.default.Types.ObjectId(context.user._id) } },
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
        categoryExpensePercentage: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!context.user)
                throw new Error('Not authenticated');
            const userId = new mongoose_1.default.Types.ObjectId(context.user._id);
            const totalAmountAgg = yield Transaction_1.Transaction.aggregate([
                { $match: { user: userId } },
                { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
            ]);
            const totalAmount = ((_a = totalAmountAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            const categoryAgg = yield Transaction_1.Transaction.aggregate([
                { $match: { user: userId } },
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
                { $unwind: '$categoryInfo' },
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
    // ...existing code...
    Mutation: {
        addTransaction: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { amount, description, categoryId, year, month, }, context) {
            if (!context.user)
                throw new Error('Not authenticated');
            const transaction = new Transaction_1.Transaction({
                amount,
                description,
                month,
                year,
                category: categoryId,
                user: context.user._id,
            });
            yield transaction.save();
            return transaction.populate('category');
        }),
        editTransaction: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, amount, description, categoryId, year, month, }, context) {
            if (!context.user)
                throw new Error('Not authenticated');
            const transaction = yield Transaction_1.Transaction.findOne({ _id: id, user: context.user._id });
            if (!transaction)
                throw new Error('Transaction not found');
            transaction.amount = amount !== null && amount !== void 0 ? amount : transaction.amount;
            transaction.description = description !== null && description !== void 0 ? description : transaction.description;
            transaction.month = month !== null && month !== void 0 ? month : transaction.month;
            transaction.year = year !== null && year !== void 0 ? year : transaction.year;
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
        // ...existing code...
    },
    // ...existing code...
};
