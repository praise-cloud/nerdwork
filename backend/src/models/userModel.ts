import { Schema, model } from 'mongoose';

interface IUser {
  walletAddress: string;
  solBalance?: number; // Optional balance field
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, unique: true },
  solBalance: { type: Number }, // Optional fi----
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>('User', userSchema);