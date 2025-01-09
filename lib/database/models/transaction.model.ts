import { Schema, model, models } from "mongoose";

export interface ITransaction extends Document {
  createdAt?: Date; // Optional since it has a default value
  stripeId: string;
  amount: number;
  plan?: string; // Optional since it's not marked as required
  credits?: number; // Optional since it's not marked as required
  buyer?:  {
    _id:string;
    firstName:string;
    lastName:string;
}  // Referencing a User by ObjectId (assumed to be a string)
}


const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Transaction = models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;