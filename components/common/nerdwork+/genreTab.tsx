'use client';

import { cn } from '@/lib/utils';
import { genres } from '@/lib/genres';

type GenreTabsProps = {
  selectedGenre: string | null;
  setSelectedGenre: (genre: string | null) => void;
};

export default function GenreTabs({ selectedGenre, setSelectedGenre }: GenreTabsProps) {
  return (
    <>
      <nav className="w-full border-b border-zinc-900 overflow-x-auto mt-5">
        <ul className="flex gap-6 px-10 py-3 text-md whitespace-nowrap text-white">
          <li
            key="all"
            className={cn(
              'text-white cursor-pointer border-b-2 border-transparent hover:border-white transition',
              selectedGenre === null && 'border-white'
            )}
            onClick={() => setSelectedGenre(null)}
          >
            All
          </li>
          {genres.map((genre) => (
            <li
              key={genre.id}
              className={cn(
                'text-white cursor-pointer border-b-2 border-transparent hover:border-white transition',
                selectedGenre === genre.name && 'border-white'
              )}
              onClick={() => setSelectedGenre(genre.name)}
            >
              {genre.name}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}