import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

enum Rarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  SUPER_RARE = 'SUPER_RARE',
  ULTRA_RARE = 'ULTRA_RARE'
}

interface INFT {
  nftId: string; 
  image: string;
  isRecentlyAdded: boolean;
  creator: string;
  rarity: Rarity;
  createdAt: Date;
  volume?: number;
  totalMinted?: number;
  totalSupply?: number;
  title?: string;
  chapters?: number;
}

const nftSchema = new Schema<INFT>({
  nftId: {type: String,required: true,unique: true, default: uuidv4},
  image: { type: String, required: true },
  isRecentlyAdded: { type: Boolean, required: true },
  creator: { type: String, required: true },
  rarity: { type: String, enum: Object.values(Rarity), default: Rarity.COMMON },
  createdAt: { type: Date, default: Date.now },
  volume: { type: Number },
  totalMinted: { type: Number },
  totalSupply: { type: Number },
  title: { type: String },
  chapters: { type: Number }
});

export const NFT = model<INFT>('NFT', nftSchema);