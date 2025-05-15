"use client";

import GenreTabs from "@/components/common/nerdwork+/genreTab";
import Navbar from "@/components/common/nerdwork+/navigationBar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WalletContextProvider } from "@/components/common/nerdwork+/navigationBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideGenreTabsRoutes = [
    /^\/nerdwork\+\/comics\/[^/]+\/chapter\/[^/]+$/,
    /^\/nerdwork\+\/comics\/[^/]+$/,
    /^\/nerdwork\+\/marketplace$/,
  ];
  const showGenreTabs = !hideGenreTabsRoutes.some((regex) => pathname.match(regex));
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  return (
    <div lang="en">
      <WalletContextProvider>
        <div className="flex flex-col min-h-screen text-white">
          <Navbar />
          {showGenreTabs && (
            <>
              <GenreTabs selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
              {children}
            </>
          )}
          {!showGenreTabs && children}
        </div>
      </WalletContextProvider>
    </div>
  );
}