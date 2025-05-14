export type Chapter = {
  number: number;
  title: string;
  description?: string;
  date: string;
  status: string;
  action: string;
};

export const chapters: Chapter[] = [
  {
    number: 1,
    title: "Chapter 1: Blessed",
    description:
      "A techno-industrial dystopia, the sprawling megalopolis of Durban stretches across the country's east coast, breeding ground for a cosmopolitan.",
    date: "April 24, 2025",
    status: "Completed",
    action: "Read",
  },
  {
    number: 2,
    title: "Chapter 2: Renewal",
    description:
      "In a world dominated by technology and industry, the vast city of New Haven sprawls along the western shores, giving rise to a chaotic blend of innovation and despair.",
    date: "April 17, 2025",
    status: "70% Complete",
    action: "Continue Reading",
  },
    {
    number: 3,
    title: "Past Lives",
    date: "April 17, 2025",
    status: "70% Complete",
    action: "Unlock 0.01 SOL",
  },
  {
    number: 4,
    title: "Netherworld",
    date: "April 17, 2025",
    status: "70% Complete",
    action: "Unlock 0.01 SOL",
  },
  {
    number: 5,
    title: "Chapter 3: Past Lives",
    description:
      "In a world dominated by technology and industry, the vast city of New Haven sprawls along the western shores, giving rise to a chaotic blend of innovation and despair.",
    date: "April 17, 2025",
    status: "70% Complete",
    action: "Unlock 0.01 SOL",
  },
];