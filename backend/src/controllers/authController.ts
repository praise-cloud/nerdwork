import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';

// Define the middleware function with proper Express types
export const loginWithWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Verify the Solana signature
    const publicKey = new PublicKey(walletAddress);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signature, 'base64');
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    );

    if (!isValid) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = await User.create({ walletAddress });
    }

    const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    res.json({ token, user: { walletAddress } });
  } catch (error) {
    console.error('Auth error:', error);
    next(error); // Pass the error to Express's error handler
  }
};