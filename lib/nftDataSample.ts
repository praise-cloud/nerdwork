export type nft = {
    id: number;
    title: string;
    chapters: number;
    image: string;
    isNew: boolean;
    price?: string; // Added for marketplace
    creator?: string; // Added for marketplace
  };

  export const nfts: nft[] = [
    { id: 1, title: "In My Head", chapters: 10, image: "/images/comics/comic_1.svg", isNew: true, price: "0.05 SOL", creator: "John Uche" },
    { id: 2, title: "Totem: Vessel of the Gods", chapters: 10, image: "/images/comics/comic_2.svg", isNew: false, price: "0.03 SOL", creator: "Aisha Bello" },
    { id: 3, title: "Ylofu: Easter Special", chapters: 1, image: "/images/comics/comic_3.svg", isNew: true, price: "0.02 SOL", creator: "Tunde Ade" },
    { id: 4, title: "Celestial Eyes", chapters: 5, image: "/images/comics/comic_4.svg", isNew: false, price: "0.04 SOL", creator: "Chidi Okoye" },
    { id: 5, title: "This Side Up", chapters: 10, image: "/images/comics/comic_5.svg", isNew: true, price: "0.06 SOL", creator: "Ngozi Eze" },
    { id: 6, title: "Kugali: An African comic anthology", chapters: 10, image: "/images/comics/comic_6.svg", isNew: false, price: "0.07 SOL", creator: "Kemi Adeyemi" },
    { id: 7, title: "Penelope of Sparta", chapters: 10, image: "/images/comics/comic_7.svg", isNew: false, price: "0.03 SOL", creator: "Sofia Mensah" },
    { id: 8, title: "Shuri", chapters: 10, image: "/images/comics/comic_8.svg", isNew: false, price: "0.05 SOL", creator: "Lerato Khumalo" },
    { id: 9, title: "The Ambassadors", chapters: 1, image: "/images/comics/comic_9.svg", isNew: true, price: "0.01 SOL", creator: "Emeka Obi" },
    { id: 10, title: "Dream", chapters: 5, image: "/images/comics/comic_10.svg", isNew: false, price: "0.02 SOL", creator: "Zara Ali" },
    { id: 11, title: "Wakanda: Okoye", chapters: 10, image: "/images/comics/comic_11.svg", isNew: false, price: "0.04 SOL", creator: "Fatima Diallo" },
    { id: 12, title: "Chirinkshe", chapters: 10, image: "/images/comics/comic_12.svg", isNew: true, price: "0.03 SOL", creator: "Bola Sanni" },
  ];