'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { nfts } from '@/lib/nftDataSample';
import { useState } from 'react';

export default function MarketplacePage() {
  const [sortFilter, setSortFilter] = useState<'new' | 'popular' | 'price-low' | 'price-high'>('new');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0.1]); // Price range in SOL

  // Filter and sort nfts
  const filterednfts = nfts
    .filter((nft) => {
      if (!nft.price) return false;
      const priceInSol = parseFloat(nft.price.replace(' SOL', ''));
      return priceInSol >= priceRange[0] && priceInSol <= priceRange[1];
    })
    .sort((a, b) => {
      if (sortFilter === 'new') {
        return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
      } else if (sortFilter === 'price-low') {
        const priceA = parseFloat(a.price!.replace(' SOL', ''));
        const priceB = parseFloat(b.price!.replace(' SOL', ''));
        return priceA - priceB;
      } else if (sortFilter === 'price-high') {
        const priceA = parseFloat(a.price!.replace(' SOL', ''));
        const priceB = parseFloat(b.price!.replace(' SOL', ''));
        return priceB - priceA;
      }
      // 'popular' sorting can be implemented with additional data (e.g., views or purchases)
      return 0;
    });

  return (
    <div className="min-h-screen text-white mt-10">
      {/* Filter Bar */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex space-x-2">
            <Button
              onClick={() => setSortFilter('new')}
              className={`${
                sortFilter === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
              } hover:bg-blue-700`}
            >
              New
            </Button>
            <Button
              onClick={() => setSortFilter('popular')}
              className={`${
                sortFilter === 'popular' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
              } hover:bg-blue-700`}
            >
              Popular
            </Button>
            <Button
              onClick={() => setSortFilter('price-low')}
              className={`${
                sortFilter === 'price-low' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
              } hover:bg-blue-700`}
            >
              Price: Low to High
            </Button>
            <Button
              onClick={() => setSortFilter('price-high')}
              className={`${
                sortFilter === 'price-high' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
              } hover:bg-blue-700`}
            >
              Price: High to Low
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Price Range (SOL):</span>
            <Input
              type="number"
              step="0.01"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseFloat(e.target.value), priceRange[1]])}
              className="w-20 bg-gray-800 border-gray-600 text-white"
              placeholder="Min"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              step="0.01"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
              className="w-20 bg-gray-800 border-gray-600 text-white"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Comic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {filterednfts.map((nft) => (
            <div key={nft.id} className="relative">
              {nft.isNew && (
                <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded">
                  New
                </span>
              )}
              <Link href={`/nerdwork+/marketplace/nft/${nft.id}`} className="block">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={nft.image}
                    alt={nft.title}
                    width={140}
                    height={250}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-2 overflow-hidden">
                  <h3 className="text-md font-semibold line-clamp-2">{nft.title}</h3>
                  <p className="text-sm text-gray-400">{nft.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}