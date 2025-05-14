'use client';

import GenreTabs from '@/components/common/nerdwork+/genreTab';
import Navbar from '@/components/common/nerdwork+/navigationBar';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showGenreTabs = !pathname.match(/^\/nerdwork\+\/comics\/[^/]+\/chapter\/[^/]+$/);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  return (
    <div lang="en">
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
    </div>
  );
}