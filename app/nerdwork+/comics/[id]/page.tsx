'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { comics } from '@/lib/comicDataSample';
import { chapters } from '@/lib/chapterDataSample';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

// Wallet context provider
function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Custom hook to use wallet
function useWalletConnection() {
  const { publicKey, connected } = useWallet();
  return {
    isConnected: connected,
    address: publicKey?.toString() || null,
  };
}

// Mock function to add comic to library (replace with real API call later)
async function addComicToLibrary(walletAddress: string | null, comicId: number) {
  if (!walletAddress) throw new Error('Wallet not connected');
  // Simulate API call to backend
  const res = await fetch('http://localhost:4000/api/library/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, comicId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add comic');
  return data;
}

export default function ComicDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params); // Unwrap the Promise
  const comic = comics.find((c) => c.id === parseInt(resolvedParams.id));
  if (!comic) return notFound();

  const [activeTab, setActiveTab] = useState<'chapters' | 'comments' | 'store'>('chapters');
  const { isConnected, address } = useWalletConnection();

  const chapter = chapters.find((chapter) => chapter.number === 1);

  const handleAddToLibrary = async () => {
    if (isConnected && address) {
      try {
        await addComicToLibrary(address, comic.id);
        alert('Comic added to your library!'); // Replace with a better UI notification
      } catch (error) {
        console.error('Error adding comic to library:', error);
        alert('Failed to add comic to library.'); // Replace with a better UI error message
      }
    } else {
      alert('Please connect your wallet to add to the library.'); // Trigger wallet modal manually if needed
    }
  };

  return (
    <WalletContextProvider>
      <div className="min-h-screen text-white px-30 py-10">
        <div className="p-6 flex flex-col md:flex-row py-10 justify-between">
          <div className="flex-1 flex flex-col max-w-xl mx-5">
            <h1 className="text-4xl font-bold">{comic.title}</h1>
            <p className="text-md text-white mt-5 mb-10">
              12+ Rating, {comic.chapters} chapters, Action Adventure
            </p>
            <p className="mt-4 text-md text-white">
              A techno-industrial dystopia, the sprawling megalopolis of Durban stretches across the country’s east coast, breeding ground for a cosmopolitan.
            </p>
            <p className="text-sm text-gray-400 mt-5">
              Author: <span className="text-white">John Uche,</span>
              Started: <span className="text-white">April 2015,</span>,
              Status: <span className="text-white">Ongoing</span>
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Genre: <span className="text-white">Action Adventure, Mythology, Supernatural, Gods, Yoruba, Dystopian</span>
            </p>
            <div className="flex gap-3 mt-15">
              {chapter && (
                <Link href={`/nerdwork+/comics/${comic.id}/chapter/${chapter.number}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">Start Reading</Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={handleAddToLibrary}
                disabled={!isConnected}
              >
                Add to Library
              </Button>
            </div>
          </div>

          <div className="relative w-full md:w-[400px] h-[500px]">
            <Image
              src={comic.image}
              alt={comic.title}
              fill
              className="object-cover rounded-lg"
            />
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
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.number}
                    href={`/nerdwork+/comics/${comic.id}/chapter/${chapter.number}`}
                    className="flex justify-between items-center py-6 border-b border-gray-700 px-5"
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
                      <Button variant="ghost" size="sm" className="border-gray-600 text-gray-300">
                        {chapter.action}
                      </Button>
                    </div>
                  </Link>
                ))}
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
      </div>
    </WalletContextProvider>
  );
}