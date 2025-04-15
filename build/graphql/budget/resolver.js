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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const Budget_1 = require("../../models/Budget");
const Category_1 = require("../../models/Category");
exports.resolvers = {
    Query: {
        recentBudgets: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield Budget_1.Budget.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('category');
        }),
        categories: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield Category_1.Category.find();
        }),
        monthWiseBudget: () => __awaiter(void 0, void 0, void 0, function* () {
            const results = yield Budget_1.Budget.aggregate([
                {
                    $group: {
                        _id: { month: '$month' }, // only group by month
                        totalAmount: { $sum: '$amount' },
                    },
                },
                {
                    $project: {
                        month: '$_id.month',
                        totalAmount: 1,
                        _id: 0,
                    },
                },
                { $sort: { month: 1 } },
            ]);
            return results;
        }),
        categoryWiseBudgetPercentage: () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const total = yield Budget_1.Budget.aggregate([
                { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
            ]);
            const totalAmount = ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 1;
            const data = yield Budget_1.Budget.aggregate([
                {
                    $group: {
                        _id: '$category',
                        categoryTotal: { $sum: '$amount' },
                    },
                },
                {
                    $project: {
                        category: '$_id',
                        percentage: {
                            $round: [{ $multiply: [{ $divide: ['$categoryTotal', totalAmount] }, 100] }, 1],
                        },
                        _id: 0,
                    },
                },
            ]);
            const populated = yield Promise.all(data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const category = yield Category_1.Category.findById(item.category);
                return {
                    category,
                    percentage: item.percentage,
                };
            })));
            return populated;
        }),
    },
    Mutation: {
        addBudget: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { categoryId, amount }) {
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const existing = yield Budget_1.Budget.findOne({ category: categoryId, month, year });
            if (existing)
                throw new Error('Budget already set for this category this month');
            const budget = new Budget_1.Budget({ category: categoryId, amount, month, year });
            yield budget.save();
            return budget.populate('category');
        }),
        editBudget: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id, amount }) {
            const budget = yield Budget_1.Budget.findById(id);
            if (!budget)
                throw new Error('Budget not found');
            budget.amount = amount;
            yield budget.save();
            return budget.populate('category');
        }),
    },
    Budget: {
        id: (parent) => parent._id.toString(),
    },
    Category: {
        id: (parent) => parent._id.toString(),
    },
};
