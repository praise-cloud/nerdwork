export type Comic = {
  id: number;
  title: string;
  chapters: number;
  image: string;
  isNew: boolean;
  genreType: string;
};

export const comics: Comic[] = [
  { id: 1, title: "In My Head", chapters: 10, image: "/images/comics/comic_1.svg", isNew: true, genreType: "Fantasy" },
  { id: 2, title: "Totem: Vessel of the Gods", chapters: 10, image: "/images/comics/comic_2.svg", isNew: false, genreType: "Mythology" },
  { id: 3, title: "Ylofu: Easter Special", chapters: 1, image: "/images/comics/comic_3.svg", isNew: true, genreType: "Adventure" },
  { id: 4, title: "Celestial Eyes", chapters: 5, image: "/images/comics/comic_4.svg", isNew: false, genreType: "Sci-Fi" },
  { id: 5, title: "This Side Up", chapters: 10, image: "/images/comics/comic_5.svg", isNew: true, genreType: "Comedy" },
  { id: 6, title: "Kugali: An African comic anthology", chapters: 10, image: "/images/comics/comic_6.svg", isNew: false, genreType: "Anthology" },
  { id: 7, title: "Penelope of Sparta", chapters: 10, image: "/images/comics/comic_7.svg", isNew: false, genreType: "Historical" },
  { id: 8, title: "Shuri", chapters: 10, image: "/images/comics/comic_8.svg", isNew: false, genreType: "Superheroes" },
  { id: 9, title: "The Ambassadors", chapters: 1, image: "/images/comics/comic_9.svg", isNew: true, genreType: "Action" },
  { id: 10, title: "Dream", chapters: 5, image: "/images/comics/comic_10.svg", isNew: false, genreType: "Fantasy" },
  { id: 11, title: "Wakanda: Okoye", chapters: 10, image: "/images/comics/comic_11.svg", isNew: false, genreType: "Superheroes" },
  { id: 12, title: "Chirinkshe", chapters: 10, image: "/images/comics/comic_12.svg", isNew: true, genreType: "Adventure" },
];