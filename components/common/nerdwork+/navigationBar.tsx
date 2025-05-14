
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { navLinks } from '@/lib/comicNavigationLinks';
import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { comics } from '@/lib/comicDataSample';
import { User } from '@/backend/src/models/userModel';

// Dynamically import wallet-related components with SSR disabled
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
const WalletModalProvider = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletModalProvider),
  { ssr: false }
);
const ConnectionProvider = dynamic(
  () => import('@solana/wallet-adapter-react').then((mod) => mod.ConnectionProvider),
  { ssr: false }
);
const WalletProvider = dynamic(
  () => import('@solana/wallet-adapter-react').then((mod) => mod.WalletProvider),
  { ssr: false }
);

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

// Wallet context provider to wrap the Navbar
function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Component to handle wallet connection, sign-up, and database update
function WalletSignUpButton() {
  const { publicKey, signMessage, wallet, disconnect } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);

  // Cleanup on unmount to disconnect wallet
  useEffect(() => {
    return () => {
      if (wallet && wallet.disconnect) {
        wallet.disconnect().catch((err) => console.error('Disconnect error:', err));
      }
    };
  }, [wallet]);

  // Handle wallet selection and database update
  useEffect(() => {
    if (publicKey && !walletAddress) {
      const address = publicKey.toString();
      setWalletAddress(address);
      fetchBalance(address);
      updateUserInDatabase(address);
    } else if (!publicKey) {
      setWalletAddress(null);
      setSolBalance(null);
    }
  }, [publicKey, walletAddress]);

  const fetchBalance = async (address: string) => {
    try {
      const connection = new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet), 'confirmed');
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;
      setSolBalance(balanceInSol);
      updateUserInDatabase(address, balanceInSol);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setSolBalance(null);
    }
  };

  const updateUserInDatabase = async (address: string, balance?: number) => {
    try {
      await User.findOneAndUpdate(
        { walletAddress: address },
        { walletAddress: address, createdAt: new Date(), ...(balance !== undefined && { solBalance: balance }) },
        { upsert: true, new: true, runValidators: true }
      );
      console.log('User updated in database:', address);
    } catch (error) {
      console.error('Error updating user in database:', error);
    }
  };

  const handleSignUp = async (address: string) => {
    if (!address || !signMessage) return;

    try {
      const message = new TextEncoder().encode('Sign up to Nerdwork');
      const signature = await signMessage(message);
      const signatureBase64 = Buffer.from(signature).toString('base64');

      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          signature: signatureBase64,
          message: 'Sign up to Nerdwork',
        }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    } catch (error) {
      console.error('Sign-up error:', error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {walletAddress && (
        <span className="text-sm text-white">
          {solBalance !== null ? (
            <span className="ml-2 text-sm text-gray-400 bg-[#1E1E1E66] py-3 px-6 rounded-md flex gap-2 items-center">
              <Image
                src="/icons/credit-card-icon.svg"
                alt="card-logo"
                width={20}
                height={20}
              />
              {solBalance.toFixed(4)} SOL
            </span>
          ) : (
            <span className="ml-2 text-xs text-gray-400">Loading...</span>
          )}
        </span>
      )}
      <WalletMultiButton
        style={{
          backgroundColor: walletAddress ? '#1E1E1E66' : '#2563eb',
          color: walletAddress ? 'white' : 'white',
          padding: '8px 16px',
          borderRadius: '5px',
          fontSize: '14px',
        }}
      />
    </div>
  );
}

// Search component to filter comics
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(comics);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults(comics);
      return;
    }
    const filteredComics = comics.filter((comic) =>
      comic.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredComics);
  }, [searchTerm]);

  return (
    <div className="relative w-90">
      <Input
        placeholder="Search comics"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-6xl text-sm items-center h-10"
      />
      {searchTerm && searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-black border border-zinc-800 rounded-md mt-1 z-10 p-2">
          <p className="p-2 border-b border-zinc-800 text-xs font-semibold">See Results</p>
          {searchResults.map((comic) => (
            <div key={comic.id} className="flex py-4 border-b border-zinc-800 w-full">
              <Image
                src={comic.image}
                alt={comic.title}
                width={50}
                height={50}
              />
              <Link
                key={comic.id}
                href={`/nerdworks+/comics/${comic.id}`}
                className="flex flex-col px-4 py-4 w-full text-white text-[15px] font-semibold hover:bg-zinc-900 rounded-md"
              >
                <div className="flex flex-col">
                  <div className="flex">{comic.title}</div>
                  <div className="flex text-xs text-gray-500">{comic.genreType}. Chapter {comic.chapters}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <WalletContextProvider>
      <header className="w-full px-6 pt-7 pb-5 text-white border-b border-zinc-900">
        <nav className="mx-auto flex items-center justify-between gap-20">
          <div className="flex items-center gap-10 flex-1 py-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icons/logo-icon.svg"
                alt="Nerdwork Logo"
                width={130}
                height={130}
              />
            </Link>
            <SearchBar />
            <div className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <WalletSignUpButton />
          </div>
        </nav>
      </header>
    </WalletContextProvider>
  );
}