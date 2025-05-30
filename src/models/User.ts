import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);