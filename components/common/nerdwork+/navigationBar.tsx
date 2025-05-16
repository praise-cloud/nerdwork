'use client';

import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/comicNavigationLinks";
import { useState, useMemo, useEffect, createContext, useContext } from "react";
import dynamic from "next/dynamic";
import { comics } from "@/lib/comicDataSample";

// Dynamically import wallet-related components with SSR disabled
const WalletMultiButtonDynamic = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
const WalletModalProviderDynamic = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletModalProvider),
  { ssr: false }
);
const ConnectionProviderDynamic = dynamic(
  () => import("@solana/wallet-adapter-react").then((mod) => mod.ConnectionProvider),
  { ssr: false }
);
const WalletProviderDynamic = dynamic(
  () => import("@solana/wallet-adapter-react").then((mod) => mod.WalletProvider),
  { ssr: false }
);

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

// Wallet context
const WalletContext = createContext<{
  address: string | null;
  connected: boolean;
  balance: number | null;
  sendTransaction?: (transaction: any, connection: any) => Promise<string>;
}>({
  address: null,
  connected: false,
  balance: null,
  sendTransaction: undefined,
});

// Component to manage wallet state after providers are loaded
function WalletStateManager({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const { publicKey, connected, sendTransaction, connecting, disconnecting } = wallet;
  const address = publicKey?.toString() || null;
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet), "confirmed");
          const balance = await connection.getBalance(publicKey);
          const balanceInSol = balance / LAMPORTS_PER_SOL;
          setBalance(balanceInSol);
        } catch (error) {
          console.error("Error fetching balance in WalletStateManager:", error);
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
  }, [publicKey]);

  useEffect(() => {
    console.log('Wallet state in WalletStateManager:', { address, connected, balance, sendTransaction, connecting, disconnecting });
  }, [address, connected, balance, sendTransaction, connecting, disconnecting]);

  return (
    <WalletContext.Provider value={{ address, connected, balance, sendTransaction }}>
      {children}
    </WalletContext.Provider>
  );
}

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [network]);

  return (
    <ConnectionProviderDynamic endpoint={endpoint}>
      <WalletProviderDynamic wallets={wallets} autoConnect={true}>
        <WalletModalProviderDynamic>
          <WalletStateManager>{children}</WalletStateManager>
        </WalletModalProviderDynamic>
      </WalletProviderDynamic>
    </ConnectionProviderDynamic>
  );
}

// Custom hook to use wallet state
export function useWalletState() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletState must be used within a WalletContextProvider");
  }
  return context;
}

// Component to handle wallet connection and sign-up
function WalletSignUpButton() {
  const { publicKey, signMessage, wallet, disconnect } = useWallet();
  const { address, balance } = useWalletState(); // Use context for balance
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (wallet && wallet.disconnect) {
        wallet.disconnect().catch((err) => console.error("Disconnect error:", err));
      }
    };
  }, [wallet]);

  useEffect(() => {
    if (publicKey && !walletAddress) {
      const address = publicKey.toString();
      setWalletAddress(address);
      updateUserInDatabase(address, balance || undefined);
    } else if (!publicKey) {
      setWalletAddress(null);
    }
  }, [publicKey, walletAddress, balance]);

  const updateUserInDatabase = async (address: string, balance?: number) => {
    // Retry mechanism with a maximum of 3 attempts
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Updating user at http://localhost:4000/api/auth/update-user`, {
          walletAddress: address,
          solBalance: balance,
          createdAt: new Date().toISOString(),
        });
        const response = await fetch("http://localhost:4000/api/auth/update-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: address,
            solBalance: balance,
            createdAt: new Date().toISOString(),
          }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status} error` }));
          throw new Error(errorData.error || `Failed to update user (HTTP ${response.status})`);
        }
        console.log("User updated successfully");
        return { success: true };
      } catch (error) {
        console.warn(`Attempt ${attempt} failed to update user:`, error);
        if (attempt === maxRetries) {
          console.error("Max retries reached. Failed to update user in database:", error);
          return { success: false, message: "User update failed after retries (backend unavailable)" };
        }
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const handleSignUp = async (address: string) => {
    if (!address || !signMessage) return;

    try {
      const message = new TextEncoder().encode("Sign up to Nerdwork");
      const signature = await signMessage(message);
      const signatureBase64 = Buffer.from(signature).toString("base64");

      const maxRetries = 3;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const res = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              walletAddress: address,
              signature: signatureBase64,
              message: "Sign up to Nerdwork",
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || `Login failed (HTTP ${res.status})`);
          }
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          return;
        } catch (error) {
          console.warn(`Attempt ${attempt} failed to sign up:`, error);
          if (attempt === maxRetries) {
            console.error("Max retries reached. Failed to sign up:", error);
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error("Sign-up error:", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {walletAddress && (
        <span className="text-sm text-white">
          {balance !== null ? (
            <span className="ml-2 text-sm text-gray-400 bg-[#1E1E1E66] py-3 px-6 rounded-md flex gap-2 items-center">
              <Image
                src="/icons/credit-card-icon.svg"
                alt="card-logo"
                width={20}
                height={20}
                style={{ width: 'auto', height: 'auto' }}
              />
              {balance.toFixed(4)} SOL
            </span>
          ) : (
            <span className="ml-2 text-xs text-gray-400">Loading...</span>
          )}
        </span>
      )}
      <WalletMultiButtonDynamic
        style={{
          backgroundColor: walletAddress ? "#1E1E1E66" : "#2563eb",
          color: walletAddress ? "white" : "white",
          padding: "8px 16px",
          borderRadius: "5px",
          fontSize: "14px",
        }}
        labels={{ main: "Sign" }}
      />
    </div>
  );
}

// Search component to filter comics
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
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
                style={{ width: 'auto', height: 'auto' }}
              />
              <Link
                key={comic.id}
                href={`/nerdwork+/comics/${comic.id}`}
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
    <header className="w-full px-6 pt-7 pb-5 text-white border-b border-zinc-900">
      <nav className="mx-auto flex items-center justify-between gap-20">
        <div className="flex items-center gap-10 flex-1 py-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/logo-icon.svg"
              alt="Nerdwork Logo"
              width={130}
              height={130}
              style={{ width: 'auto', height: 'auto' }}
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
  );
}