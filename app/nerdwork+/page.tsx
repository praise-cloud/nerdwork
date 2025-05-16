'use client';

import Image from 'next/image';
import Link from 'next/link';
import { comics } from '@/lib/comicDataSample';
import React from 'react';

// Define the PageProps type to match Next.js's expectation
interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default function ComicsPage({ params: paramsPromise, searchParams: searchParamsPromise }: PageProps) {
  // Unwrap the params Promise using React.use()
  React.use(paramsPromise);
  // Unwrap the searchParams Promise, default to empty object if undefined
  const searchParams = React.use(searchParamsPromise ?? Promise.resolve({}));
  // Derive selectedGenre from searchParams, default to null if not present
  const selectedGenre = searchParams.selectedGenre ? String(searchParams.selectedGenre) : null;

  const filteredComics = selectedGenre
    ? comics.filter((comic) => comic.genreType === selectedGenre)
    : comics;

  return (
    <div className="min-h-screen text-white mt-10">
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredComics.length > 0 ? (
            filteredComics.map((comic) => (
              <Link key={comic.id} href={`/nerdwork+/comics/${comic.id}`} className="block">
                <div className="relative overflow-hidden rounded-lg hover:shadow-lg transition-shadow">
                  {comic.isNew && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      New
                    </span>
                  )}
                  <Image
                    src={comic.image}
                    alt={comic.title}
                    width={140}
                    height={250}
                    className="object-cover w-full h-full"
                  />
                  <div className="p-2 overflow-hidden">
                    <h3 className="text-md font-semibold line-clamp-2">{comic.title}</h3>
                    <p className="text-sm text-gray-400">{comic.chapters} chapters</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-lg">
              Not Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}