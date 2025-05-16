'use client';

import { comics } from '@/lib/comicDataSample';
import { chapters } from '@/lib/chapterDataSample';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ComicViewingPage({ params }: { params: Promise<{ id: string; number: string }> }) {
  const resolvedParams = React.use(params);
  console.log('Resolved params:', resolvedParams);

  const comicId = parseInt(resolvedParams.id);
  const chapterNumber = parseInt(resolvedParams.number);

  console.log('Parsed comicId:', comicId, 'chapterNumber:', chapterNumber);
  if (isNaN(comicId) || isNaN(chapterNumber)) {
    console.log('Invalid ID or chapter number detected');
    return <div>Invalid ID or chapter number: {resolvedParams.id}, {resolvedParams.number}</div>;
  }

  const comic = comics.find((c) => c.id === comicId);
  console.log('Found comic:', comic);
  if (!comic) {
    console.log('Comic not found for ID:', comicId);
    return <div>Comic not found for ID: {comicId}</div>;
  }

  const chapter = chapters.find((ch) => ch.comicId === comicId && ch.number === chapterNumber);
  console.log('Found chapter:', chapter);
  if (!chapter) {
    console.log('Chapter not found for comicId:', comicId, 'chapterNumber:', chapterNumber);
    return <div>Chapter not found for comicId: {comicId}, chapterNumber: {chapterNumber}</div>;
  }

  const allChapters = chapters.filter((ch) => ch.comicId === comicId).sort((a, b) => a.number - b.number);
  const currentIndex = allChapters.findIndex((ch) => ch.number === chapterNumber);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      <div className="w-full max-w-4xl px-6 mb-6">
        {/* <h1 className="text-3xl font-bold">{comic.title}</h1> */}
        {/* <h2 className="text-xl text-gray-400 mt-2">{chapter.title}</h2> */}
        {/* <p className="text-gray-500 mt-1">{chapter.description}</p> */}
        {/* <div className="flex gap-4 mt-4">
          {prevChapter && (
            <Link href={`/nerdwork+/comics/${comic.id}/chapter/${prevChapter.number}`} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
              Previous Chapter
            </Link>
          )}
          {nextChapter && (
            <Link href={`/nerdwork+/comics/${comic.id}/chapter/${nextChapter.number}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Next Chapter
            </Link>
          )}
        </div> */}
      </div>
      <div className="w-full max-w-3xl flex flex-col items-center">
        {chapter.pages && chapter.pages.length > 0 ? (
          chapter.pages.map((page, index) => (
            <div key={index} className="w-full mb-4">
              <Image src={page} alt={`Page ${index + 1} of ${chapter.title}`} width={800} height={1200} className="object-contain w-full" />
              {/* <p className="text-center text-gray-400 mt-2">Page {index + 1}</p> */}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No pages available for this chapter.</p>
        )}
      </div>
      <div className="w-full max-w-4xl px-6 mt-6 flex justify-between">
        {prevChapter ? (
          <Link href={`/nerdwork+/comics/${comic.id}/chapter/${prevChapter.number}`} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
            Previous Chapter
          </Link>
        ) : (
          <div></div>
        )}
        {nextChapter && (
          <Link href={`/nerdwork+/comics/${comic.id}/chapter/${nextChapter.number}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Next Chapter
          </Link>
        )}
      </div>
    </div>
  );
}