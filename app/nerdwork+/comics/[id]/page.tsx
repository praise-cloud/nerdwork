/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { comics } from '@/lib/comicDataSample';
import { chapters as initialChapters } from '@/lib/chapterDataSample';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { useWalletState } from '@/components/common/nerdwork+/navigationBar';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';
import PurchaseModal from '@/components/common/nerdwork+/purchaseModal';

// Function to add comic to library using wallet address as user ID
async function addComicToLibrary(userId: string | null, comicId: number) {
  if (!userId) throw new Error('Wallet not connected');
  try {
    const res = await fetch('http://localhost:4000/api/library/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, comicId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add comic');
    return data;
  } catch (error) {
    console.error('Failed to add comic to library (backend unavailable):', error);
    return { success: true, message: 'Comic added locally (backend sync failed)' };
  }
}

// Function to purchase chapter using wallet address as user ID
async function purchaseChapter(userId: string | null, chapterId: number, sendTransaction: (transaction: Transaction, connection: any) => Promise<string>) {
  if (!userId) throw new Error('Wallet not connected');
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const buyerPublicKey = new PublicKey(userId);

  // Replace with an actual seller public key (e.g., a devnet wallet address you control)
  const sellerPublicKey = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // Dummy address for testing

  const lamports = 0.01 * LAMPORTS_PER_SOL; // Price of the chapter in lamports

  // Check buyer's balance
  const buyerBalance = await connection.getBalance(buyerPublicKey);
  const minBalanceRequired = lamports + 5000; // Transaction amount + approximate fee (~0.000005 SOL)
  if (buyerBalance < minBalanceRequired) {
    throw new Error(`Insufficient balance. Required: ${(minBalanceRequired / LAMPORTS_PER_SOL).toFixed(6)} SOL, Available: ${(buyerBalance / LAMPORTS_PER_SOL).toFixed(6)} SOL`);
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      toPubkey: sellerPublicKey,
      lamports,
    })
  );

  try {
    // Fetch a fresh blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = buyerPublicKey;

    console.log('Transaction prepared:', transaction);

    // Send the transaction
    const signature = await sendTransaction(transaction, connection);
    console.log('Transaction sent, signature:', signature);

    // Confirm the transaction with a timeout
    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      'confirmed'
    );

    if (confirmation.value.err) {
      throw new Error(`Transaction confirmation failed: ${JSON.stringify(confirmation.value.err)}`);
    }

    console.log('Transaction confirmed:', confirmation);

    // Log the transaction details to your backend (non-critical operation)
    try {
      await fetch('http://localhost:4000/api/transactions/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          chapterId,
          signature,
          amount: lamports / LAMPORTS_PER_SOL,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to log transaction to backend:', error);
      // Continue execution even if backend logging fails
    }

    return { success: true, signature };
  } catch (error) {
    console.error('Purchase failed:', error);
    throw error instanceof Error ? error : new Error('Transaction failed: Unknown error');
  }
}

export default function ComicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const comicId = parseInt(resolvedParams.id);
  if (isNaN(comicId)) return notFound();

  const comic = comics.find((c) => c.id === comicId);
  if (!comic) return notFound();

  const router = useRouter(); // Initialize useRouter for navigation
  const { address, connected, balance, sendTransaction } = useWalletState();
  const [activeTab, setActiveTab] = useState<'chapters' | 'comments' | 'store'>('chapters');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [comicChapters, setComicChapters] = useState(initialChapters.filter((ch) => ch.comicId === comic.id));
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('Wallet state in ComicDetailPage:', { address, connected, balance, sendTransaction });
    console.log('Comic chapters:', comicChapters);
  }, [address, connected, balance, sendTransaction, comicChapters]);

  const firstChapter = comicChapters.find((ch) => ch.number === 1);

  const handleAddToLibrary = async () => {
    if (connected && address) {
      try {
        await addComicToLibrary(address, comic.id);
        alert('Comic added to your library!');
      } catch (error) {
        console.error('Error adding comic to library:', error);
        alert('Failed to add comic to library.');
      }
    } else {
      alert('Please connect your wallet to add to the library.');
    }
  };

  const handleChapterClick = (chapterNumber: number) => {
    const chapter = comicChapters.find((ch) => ch.number === chapterNumber);
    console.log('Chapter click check:', { chapter, connected, address });
    if (chapter) {
      if (chapter.locked && chapter.action === 'Unlock 0.01 SOL' && connected && address) {
        setSelectedChapter(chapterNumber);
        setTransactionStatus('idle'); // Reset transaction status when opening the modal
        setErrorMessage(null);
        setShowPurchaseModal(true);
      } else if (chapter.locked && chapter.action === 'Unlock 0.01 SOL') {
        alert('Please connect your wallet to unlock this chapter.');
      } else if (!chapter.locked) {
        // Redirect to the chapter viewing page if unlocked
        router.push(`/nerdwork+/comics/${comicId}/chapter/${chapterNumber}`);
      }
    }
  };

  const handlePurchase = async () => {
    if (selectedChapter && connected && address && sendTransaction) {
      setTransactionStatus('loading');
      setErrorMessage(null);
      try {
        const result = await purchaseChapter(address, selectedChapter, sendTransaction);
        if (result.success) {
          setTransactionStatus('success');
          // Update the chapter state in comicChapters
          setComicChapters((prevChapters) =>
            prevChapters.map((chapter) =>
              chapter.number === selectedChapter && chapter.comicId === comicId
                ? { ...chapter, action: 'Read', locked: false }
                : chapter
            )
          );
          console.log('Updated comic chapters after purchase:', comicChapters);
        }
      } catch (error) {
        setTransactionStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to unlock chapter.');
        console.error('Purchase error:', error);
      }
    } else {
      setTransactionStatus('error');
      setErrorMessage('Please connect your wallet to proceed with the purchase.');
    }
  };

  const handleCloseModal = () => {
    setShowPurchaseModal(false);
    setTransactionStatus('idle');
    setErrorMessage(null);
    setSelectedChapter(null);
  };

  const getChapterTitle = (chapterNumber: number) => {
    const chapter = comicChapters.find((ch) => ch.number === chapterNumber);
    return chapter ? chapter.title : 'Unknown Chapter';
  };

  return (
    <div className="min-h-screen text-white px-30 py-10">
      <div className="p-6 flex flex-col md:flex-row py-10 justify-between">
        <div className="flex-1 flex flex-col max-w-xl mx-5">
          <h1 className="text-4xl font-bold">{comic.title}</h1>
          <p className="text-md text-white mt-5 mb-10">
            12+ Rating, {comic.chapters} chapters, Action Adventure
          </p>
          <p className="mt-4 text-md text-white">
            A techno-industrial dystopia, the sprawling megalopolis of Durban stretches across the country&aspo;s east coast, breeding ground for a cosmopolitan.
          </p>
          <p className="text-sm text-gray-400 mt-5">
            Author: <span className="text-white">John Uche,</span> Started: <span className="text-white">April 2015,</span> Status: <span className="text-white">Ongoing</span>
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Genre: <span className="text-white">Action Adventure, Mythology, Supernatural, Gods, Yoruba, Dystopian</span>
          </p>
          <div className="flex gap-3 mt-15">
            {firstChapter && !firstChapter.locked ? (
              <Link href={`/nerdwork+/comics/${comicId}/chapter/${firstChapter.number}`}>
                <Button className="bg-blue-600 hover:bg-blue-700">Start Reading</Button>
              </Link>
            ) : firstChapter ? (
              <Button className="bg-gray-600 cursor-pointer" onClick={() => handleChapterClick(firstChapter.number)}>
                Unlock 0.01 SOL
              </Button>
            ) : (
              <Button disabled className="bg-gray-600">No Chapters Available</Button>
            )}
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={handleAddToLibrary}
              disabled={!connected}
            >
              Add to Library
            </Button>
          </div>
        </div>

        <div className="relative w-full md:w-[400px] h-[500px]">
          <Image src={comic.image} alt={comic.title} fill className="object-cover rounded-lg" priority />
        </div>
      </div>

      <div className="px-6">
        <div className="flex space-x-4 border-zinc-800 border-b p-2">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-4 py-2 ${activeTab === 'chapters' ? 'text-white font-bold text-md pb-5 border-b-2 border-white' : 'text-gray-300'}`}
          >
            {comic.chapters} Chapters
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-4 ${activeTab === 'comments' ? 'text-white font-bold text-md pb-5 border-b-2 border-white' : 'text-gray-300'}`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-4 ${activeTab === 'store' ? 'text-white font-bold text-md pb-5 border-b-2 border-white' : 'text-gray-300'}`}
          >
            Store
          </button>
        </div>

        <div className="mt-5">
          {activeTab === 'chapters' && (
            <div>
              {comicChapters.length > 0 ? (
                comicChapters.map((chapter) => (
                  <div
                    key={chapter.number}
                    className="flex justify-between items-center py-6 border-b border-gray-700 px-5 cursor-pointer"
                  >
                    <div className="flex flex-grow gap-4 items-center">
                      <p className="text-gray-500 text-[18px] font-bold min-w-[30px]">
                        #{chapter.number}
                      </p>
                      <div className="flex flex-col">
                        <h3 className="text-md font-semibold">{chapter.title}</h3>
                        {chapter.description && chapter.description.length > 0 && (
                          <p className="text-xs text-gray mt-1 max-w-md overflow-hidden text-ellipsis whitespace-nowrap">
                            {chapter.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{chapter.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <p className="text-xs text-gray-400">{chapter.date}</p>
                      {chapter.locked && chapter.action === 'Unlock 0.01 SOL' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="border-gray-600 text-gray-300"
                          onClick={() => handleChapterClick(chapter.number)}
                        >
                          Unlock 0.01 SOL
                        </Button>
                      ) : (
                        <Link href={`/nerdwork+/comics/${comicId}/chapter/${chapter.number}`}>
                          <Button variant="ghost" size="sm" className="border-gray-600 text-gray-300">
                            {chapter.action}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No chapters available for this comic.</p>
              )}
            </div>
          )}
          {activeTab === 'comments' && (
            <div>
              <p>Comments section coming soon.</p>
            </div>
          )}
          {activeTab === 'store' && (
            <div>
              <p>Store section coming soon.</p>
            </div>
          )}
        </div>
      </div>

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={handleCloseModal}
        chapterNumber={selectedChapter || 0}
        chapterTitle={selectedChapter ? getChapterTitle(selectedChapter) : ''}
        price="0.01 SOL"
        address={address}
        connected={connected}
        balance={balance}
        onConfirm={handlePurchase}
        transactionStatus={transactionStatus}
        errorMessage={errorMessage}
      />
    </div>
  );
}