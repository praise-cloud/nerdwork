'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterNumber: number;
  chapterTitle: string;
  price: string;
  address: string | null;
  connected: boolean;
  balance: number | null;
  onConfirm: () => void;
  transactionStatus: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  chapterNumber,
  chapterTitle,
  price,
  address,
  connected,
  balance,
  onConfirm,
  transactionStatus,
  errorMessage,
}: PurchaseModalProps) {
  const lamportsPrice = parseFloat(price) * 1_000_000_000; // Convert SOL to lamports
  const hasSufficientBalance = balance !== null && balance >= lamportsPrice;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C2526] text-white border-none max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock Chapter</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {transactionStatus === 'success' ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-green-400">Chapter Unlocked Successfully!</p>
              <p className="text-sm text-gray-300 mt-2">
                Chapter {chapterNumber}: {chapterTitle} is now available to read.
              </p>
              <Button
                onClick={onClose}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <p>
                You are about to unlock <span className="font-semibold">Chapter {chapterNumber}: {chapterTitle}</span> for {price}.
              </p>
              {connected && address ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-300">Wallet Address: {address.slice(0, 4)}...{address.slice(-4)}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    Balance: {balance !== null ? `${(balance / 1_000_000_000).toFixed(6)} SOL` : 'Loading...'}
                  </p>
                  {!hasSufficientBalance && balance !== null && (
                    <p className="text-sm text-red-400 mt-1">Insufficient balance to unlock this chapter.</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-400 mt-4">Please connect your wallet to proceed.</p>
              )}
              {transactionStatus === 'error' && errorMessage && (
                <p className="text-sm text-red-400 mt-4">{errorMessage}</p>
              )}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/credit-card-icon.svg"
                    alt="Credit Card"
                    width={24}
                    height={24}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                  <p>{price}</p>
                </div>
                <Button
                  onClick={onConfirm}
                  disabled={!connected || !hasSufficientBalance || transactionStatus === 'loading'}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                >
                  {transactionStatus === 'loading' ? 'Processing...' : 'Continue'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}