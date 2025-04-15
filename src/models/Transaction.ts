// src/models/Transaction.ts
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String },
  month: { type: Number, required: true }, // 1 = January, 12 = December
  year: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', TransactionSchema);
