'use client';

    import Image from 'next/image';
    import { Button } from '@/components/ui/button';
    import { notFound } from 'next/navigation';
    import { useState, useEffect, useMemo } from 'react';
    import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
    import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
    import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
    import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
    import { clusterApiUrl } from '@solana/web3.js';
    import '@solana/wallet-adapter-react-ui/styles.css';

    // Import wallet adapter styles
    import '@solana/wallet-adapter-react-ui/styles.css';

    function WalletContextProvider({ children }: { children: React.ReactNode }) {
      const network = WalletAdapterNetwork.Devnet;
      const endpoint = useMemo(() => clusterApiUrl(network), [network]);
      const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
        [network]
      );

      return (
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      );
    }

    export default function NFTDetailPage({ params }: { params: { id: string } }) {
      const [nft, setNFT] = useState<any>(null);
      const [chapters, setChapters] = useState<any[]>([]);
      const [activeTab, setActiveTab] = useState<'details' | 'chapters' | 'activity'>('details');
      const [activity, setActivity] = useState<any[]>([]);
      const [walletAddress, setWalletAddress] = useState<string | null>(null);
      const [token, setToken] = useState<string | null>(null);

      useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);

        async function fetchNFT() {
          const res = await fetch(`http://localhost:4000/api/nft/${params.id}`, {
            headers: { Authorization: `Bearer ${storedToken || token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch NFT');
          const data = await res.json();
          setNFT(data);
        }

        async function fetchChapters() {
          const res = await fetch(`/api/comics/${params.id}/chapters`);
          if (!res.ok) throw new Error('Failed to fetch chapters');
          const data = await res.json();
          setChapters(data);
        }

        async function fetchActivity() {
          const res = await fetch(`http://localhost:4000/api/nft/${params.id}/activity`, {
            headers: { Authorization: `Bearer ${storedToken || token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch activity');
          const data = await res.json();
          setActivity(data);
        }

        if (token || storedToken) {
          fetchNFT();
          fetchChapters();
          fetchActivity();
        }
      }, [params.id, token]);

      if (!nft) return notFound();

      const handleMint = async () => {
        if (!walletAddress || !token) {
          alert('Please connect your wallet first');
          return;
        }
        const res = await fetch('http://localhost:4000/api/nft/mint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comicId: nft.nftId, userId: walletAddress }),
        });
        const result = await res.json();
        alert(result.message || result.error);
      };

      return (
        <WalletContextProvider>
            <div className="container mx-auto px-6 py-10">
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="relative w-full lg:w-[400px] h-[500px] flex-shrink-0">
                  <Image
                    src={nft.image}
                    alt={nft.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold">{nft.title}</h1>
                  <p className="mt-2 text-sm text-gray-400">by {nft.creator}</p>
                  <p className="mt-4 text-sm">
                    A techno-industrial dystopia, the sprawling megalopolis of Durban stretches across the country’s east coast, breeding ground for a cosmopolitan.
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-lg font-semibold">Volume {nft.volume}: Mint for 0.05 SOL</span>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                      onClick={handleMint}
                    >
                      Mint Now
                    </Button>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    <p>Minted: {nft.totalMinted}/{nft.totalSupply}</p>
                    <p>Rarity: {nft.rarity}</p>
                    <p>{nft.isRecentlyAdded ? 'Recently Added' : 'Not Recently Added'}</p>
                  </div>
                  <div className="mt-6">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setActiveTab('chapters')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'chapters' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                      >
                        Chapters {nft.chapters}
                      </button>
                      <button
                        onClick={() => setActiveTab('activity')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'activity' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                      >
                        Activity
                      </button>
                    </div>
                    <div className="mt-4">
                      {activeTab === 'details' && (
                        <div>
                          <p className="text-sm text-gray-400">
                            Volume {nft.volume}: A thrilling continuation of the {nft.title} saga, delving deeper into the dystopian world of Durban.
                          </p>
                          <p className="mt-2 text-sm text-gray-400">
                            Creator: {nft.creator}
                          </p>
                          <p className="mt-2 text-sm text-gray-400">
                            Contract Address: 0xD4AF... (mock)
                          </p>
                          <p className="mt-2 text-sm text-gray-400">
                            Token Standard: ERC-721 (mock)
                          </p>
                        </div>
                      )}
                      {activeTab === 'chapters' && (
                        <div>
                          {chapters.map((chapter: any) => (
                            <div
                              key={chapter.number}
                              className="flex justify-between items-center py-4 border-b border-gray-700"
                            >
                              <div>
                                <h3 className="text-sm font-semibold">
                                  #{chapter.number} {chapter.title}
                                </h3>
                                {chapter.description && (
                                  <p className="text-xs text-gray-400 mt-1">{chapter.description}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">{chapter.status}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-400">{chapter.date}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  {chapter.action}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {activeTab === 'activity' && (
                        <div>
                          {activity.map((item: any) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center py-4 border-b border-gray-700"
                            >
                              <div>
                                <p className="text-sm">{item.action} by {item.user}</p>
                                <p className="text-xs text-gray-400">{item.comicTitle}</p>
                              </div>
                              <p className="text-xs text-gray-400">{item.time}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </WalletContextProvider>
      )
    }