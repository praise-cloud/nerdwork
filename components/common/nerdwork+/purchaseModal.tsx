'use client';

import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { X, Wallet } from 'lucide-react';

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
  errorMessage: externalErrorMessage,
}: PurchaseModalProps) {
  const [internalErrorMessage, setInternalErrorMessage] = useState<string | null>(null);

  // Parse price from string (e.g., "0.01 SOL") to number
  const priceValue = parseFloat(price);

  useEffect(() => {
    if (balance !== null && !isNaN(priceValue)) {
      if (balance < priceValue) {
        setInternalErrorMessage('You do not have enough funds. Buy SOL or deposit from another account');
      } else {
        setInternalErrorMessage(null);
      }
    }
  }, [balance, priceValue]);

  // Combine internal and external error messages
  const errorMessage = externalErrorMessage || internalErrorMessage;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-zinc-800 px-8 py-12 rounded-lg w-[550px] text-white relative">
        {transactionStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <h2 className="text-3xl font-bold text-green-400 mb-4">Success!</h2>
            <p className="text-xl font-semibold">Chapter Unlocked</p>
            <p className="text-gray-400 mt-2 text-center">
              Chapter #{chapterNumber} - {chapterTitle} is now available to read.
            </p>
            <Button
              onClick={onClose}
              className="mt-6 w-full bg-blue-500 hover:bg-blue-700 h-14 text-md font-semibold"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            {/* Close Icon */}
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold mb-8">Unlock Chapter</h2>
              <button
                onClick={onClose}
                className="absolute top-15 right-10 text-white focus:outline-none"
                aria-label="Close modal"
              >
                <X className="h-8 w-8" />
              </button>
            </div>
            <div className="flex flex-col space-y-8">
              <div className="flex justify-between border-1 border-zinc-500 rounded-xl px-5 py-4 items-center font-medium text-[18px]">
                <p>#{chapterNumber} {chapterTitle}</p>
                <p>{price}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-medium text-[18px] mb-4">Your Wallet</p>
                <div className="flex justify-between border-1 border-zinc-500 rounded-xl px-5 py-4 items-center font-medium text-[18px]">
                  <div className="flex flex-col gap-3">
                    <p className="text-md">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                    </p>
                    <p className="text-gray-400">SOLANA</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-gray-400" />
                    <p>{balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}</p>
                  </div>
                </div>
                {errorMessage && (
                  <p className="text-center text-orange-500 text-sm mt-2">{errorMessage}</p>
                )}
              </div>
              <Button
                className="w-full bg-blue-500 hover:bg-blue-700 h-14 text-md font-semibold"
                onClick={onConfirm}
                disabled={
                  transactionStatus === 'loading' ||
                  !connected ||
                  !address ||
                  (balance !== null && !isNaN(priceValue) && balance < priceValue)
                }
              >
                {transactionStatus === 'loading' ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}