export interface BibleBook {
  name: string;
  englishName?: string; // English name for cross-language mapping
  abbreviation: string;
  chapters: number;
  testament: 'Old' | 'New';
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface BibleReference {
  book: string;
  chapter: number;
  verse?: number;
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { name: 'Genesis', abbreviation: 'Gen', chapters: 50, testament: 'Old' },
  { name: 'Exodus', abbreviation: 'Exo', chapters: 40, testament: 'Old' },
  { name: 'Leviticus', abbreviation: 'Lev', chapters: 27, testament: 'Old' },
  { name: 'Numbers', abbreviation: 'Num', chapters: 36, testament: 'Old' },
  { name: 'Deuteronomy', abbreviation: 'Deu', chapters: 34, testament: 'Old' },
  { name: 'Joshua', abbreviation: 'Jos', chapters: 24, testament: 'Old' },
  { name: 'Judges', abbreviation: 'Jdg', chapters: 21, testament: 'Old' },
  { name: 'Ruth', abbreviation: 'Rut', chapters: 4, testament: 'Old' },
  { name: '1 Samuel', abbreviation: '1Sa', chapters: 31, testament: 'Old' },
  { name: '2 Samuel', abbreviation: '2Sa', chapters: 24, testament: 'Old' },
  { name: '1 Kings', abbreviation: '1Ki', chapters: 22, testament: 'Old' },
  { name: '2 Kings', abbreviation: '2Ki', chapters: 25, testament: 'Old' },
  { name: '1 Chronicles', abbreviation: '1Ch', chapters: 29, testament: 'Old' },
  { name: '2 Chronicles', abbreviation: '2Ch', chapters: 36, testament: 'Old' },
  { name: 'Ezra', abbreviation: 'Ezr', chapters: 10, testament: 'Old' },
  { name: 'Nehemiah', abbreviation: 'Neh', chapters: 13, testament: 'Old' },
  { name: 'Esther', abbreviation: 'Est', chapters: 10, testament: 'Old' },
  { name: 'Job', abbreviation: 'Job', chapters: 42, testament: 'Old' },
  { name: 'Psalms', abbreviation: 'Psa', chapters: 150, testament: 'Old' },
  { name: 'Proverbs', abbreviation: 'Pro', chapters: 31, testament: 'Old' },
  { name: 'Ecclesiastes', abbreviation: 'Ecc', chapters: 12, testament: 'Old' },
  { name: 'Song of Solomon', abbreviation: 'SoS', chapters: 8, testament: 'Old' },
  { name: 'Isaiah', abbreviation: 'Isa', chapters: 66, testament: 'Old' },
  { name: 'Jeremiah', abbreviation: 'Jer', chapters: 52, testament: 'Old' },
  { name: 'Lamentations', abbreviation: 'Lam', chapters: 5, testament: 'Old' },
  { name: 'Ezekiel', abbreviation: 'Eze', chapters: 48, testament: 'Old' },
  { name: 'Daniel', abbreviation: 'Dan', chapters: 12, testament: 'Old' },
  { name: 'Hosea', abbreviation: 'Hos', chapters: 14, testament: 'Old' },
  { name: 'Joel', abbreviation: 'Joe', chapters: 3, testament: 'Old' },
  { name: 'Amos', abbreviation: 'Amo', chapters: 9, testament: 'Old' },
  { name: 'Obadiah', abbreviation: 'Oba', chapters: 1, testament: 'Old' },
  { name: 'Jonah', abbreviation: 'Jon', chapters: 4, testament: 'Old' },
  { name: 'Micah', abbreviation: 'Mic', chapters: 7, testament: 'Old' },
  { name: 'Nahum', abbreviation: 'Nah', chapters: 3, testament: 'Old' },
  { name: 'Habakkuk', abbreviation: 'Hab', chapters: 3, testament: 'Old' },
  { name: 'Zephaniah', abbreviation: 'Zep', chapters: 3, testament: 'Old' },
  { name: 'Haggai', abbreviation: 'Hag', chapters: 2, testament: 'Old' },
  { name: 'Zechariah', abbreviation: 'Zec', chapters: 14, testament: 'Old' },
  { name: 'Malachi', abbreviation: 'Mal', chapters: 4, testament: 'Old' },
  
  // New Testament
  { name: 'Matthew', abbreviation: 'Mat', chapters: 28, testament: 'New' },
  { name: 'Mark', abbreviation: 'Mar', chapters: 16, testament: 'New' },
  { name: 'Luke', abbreviation: 'Luk', chapters: 24, testament: 'New' },
  { name: 'John', abbreviation: 'Joh', chapters: 21, testament: 'New' },
  { name: 'Acts', abbreviation: 'Act', chapters: 28, testament: 'New' },
  { name: 'Romans', abbreviation: 'Rom', chapters: 16, testament: 'New' },
  { name: '1 Corinthians', abbreviation: '1Co', chapters: 16, testament: 'New' },
  { name: '2 Corinthians', abbreviation: '2Co', chapters: 13, testament: 'New' },
  { name: 'Galatians', abbreviation: 'Gal', chapters: 6, testament: 'New' },
  { name: 'Ephesians', abbreviation: 'Eph', chapters: 6, testament: 'New' },
  { name: 'Philippians', abbreviation: 'Phi', chapters: 4, testament: 'New' },
  { name: 'Colossians', abbreviation: 'Col', chapters: 4, testament: 'New' },
  { name: '1 Thessalonians', abbreviation: '1Th', chapters: 5, testament: 'New' },
  { name: '2 Thessalonians', abbreviation: '2Th', chapters: 3, testament: 'New' },
  { name: '1 Timothy', abbreviation: '1Ti', chapters: 6, testament: 'New' },
  { name: '2 Timothy', abbreviation: '2Ti', chapters: 4, testament: 'New' },
  { name: 'Titus', abbreviation: 'Tit', chapters: 3, testament: 'New' },
  { name: 'Philemon', abbreviation: 'Phm', chapters: 1, testament: 'New' },
  { name: 'Hebrews', abbreviation: 'Heb', chapters: 13, testament: 'New' },
  { name: 'James', abbreviation: 'Jam', chapters: 5, testament: 'New' },
  { name: '1 Peter', abbreviation: '1Pe', chapters: 5, testament: 'New' },
  { name: '2 Peter', abbreviation: '2Pe', chapters: 3, testament: 'New' },
  { name: '1 John', abbreviation: '1Jo', chapters: 5, testament: 'New' },
  { name: '2 John', abbreviation: '2Jo', chapters: 1, testament: 'New' },
  { name: '3 John', abbreviation: '3Jo', chapters: 1, testament: 'New' },
  { name: 'Jude', abbreviation: 'Jud', chapters: 1, testament: 'New' },
  { name: 'Revelation', abbreviation: 'Rev', chapters: 22, testament: 'New' },
];

export const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(book => book.testament === 'Old');
export const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(book => book.testament === 'New');
