/**
 * Book Name Mapping Utility
 * 
 * Maps Bible book names between different languages and translations.
 * This allows the UI to display books in the appropriate language
 * while maintaining compatibility with different Bible JSON structures.
 */

export interface BookNameMapping {
  english: string;
  spanish: string;
  abbreviation: string;
  chapters: number;
  testament: 'Old' | 'New';
}

export const BOOK_NAME_MAPPINGS: BookNameMapping[] = [
  // Old Testament
  { english: 'Genesis', spanish: 'Génesis', abbreviation: 'GEN', chapters: 50, testament: 'Old' },
  { english: 'Exodus', spanish: 'Éxodo', abbreviation: 'EXO', chapters: 40, testament: 'Old' },
  { english: 'Leviticus', spanish: 'Levítico', abbreviation: 'LEV', chapters: 27, testament: 'Old' },
  { english: 'Numbers', spanish: 'Números', abbreviation: 'NUM', chapters: 36, testament: 'Old' },
  { english: 'Deuteronomy', spanish: 'Deuteronomio', abbreviation: 'DEU', chapters: 34, testament: 'Old' },
  { english: 'Joshua', spanish: 'Josué', abbreviation: 'JOS', chapters: 24, testament: 'Old' },
  { english: 'Judges', spanish: 'Jueces', abbreviation: 'JDG', chapters: 21, testament: 'Old' },
  { english: 'Ruth', spanish: 'Rut', abbreviation: 'RUT', chapters: 4, testament: 'Old' },
  { english: '1 Samuel', spanish: '1 Samuel', abbreviation: '1SA', chapters: 31, testament: 'Old' },
  { english: '2 Samuel', spanish: '2 Samuel', abbreviation: '2SA', chapters: 24, testament: 'Old' },
  { english: '1 Kings', spanish: '1 Reyes', abbreviation: '1KI', chapters: 22, testament: 'Old' },
  { english: '2 Kings', spanish: '2 Reyes', abbreviation: '2KI', chapters: 25, testament: 'Old' },
  { english: '1 Chronicles', spanish: '1 Crónicas', abbreviation: '1CH', chapters: 29, testament: 'Old' },
  { english: '2 Chronicles', spanish: '2 Crónicas', abbreviation: '2CH', chapters: 36, testament: 'Old' },
  { english: 'Ezra', spanish: 'Esdras', abbreviation: 'EZR', chapters: 10, testament: 'Old' },
  { english: 'Nehemiah', spanish: 'Nehemías', abbreviation: 'NEH', chapters: 13, testament: 'Old' },
  { english: 'Esther', spanish: 'Ester', abbreviation: 'EST', chapters: 10, testament: 'Old' },
  { english: 'Job', spanish: 'Job', abbreviation: 'JOB', chapters: 42, testament: 'Old' },
  { english: 'Psalms', spanish: 'Salmos', abbreviation: 'PSA', chapters: 150, testament: 'Old' },
  { english: 'Proverbs', spanish: 'Proverbios', abbreviation: 'PRO', chapters: 31, testament: 'Old' },
  { english: 'Ecclesiastes', spanish: 'Eclesiastés', abbreviation: 'ECC', chapters: 12, testament: 'Old' },
  { english: 'Song of Solomon', spanish: 'Cantares', abbreviation: 'SNG', chapters: 8, testament: 'Old' },
  { english: 'Isaiah', spanish: 'Isaías', abbreviation: 'ISA', chapters: 66, testament: 'Old' },
  { english: 'Jeremiah', spanish: 'Jeremías', abbreviation: 'JER', chapters: 52, testament: 'Old' },
  { english: 'Lamentations', spanish: 'Lamentaciones', abbreviation: 'LAM', chapters: 5, testament: 'Old' },
  { english: 'Ezekiel', spanish: 'Ezequiel', abbreviation: 'EZE', chapters: 48, testament: 'Old' },
  { english: 'Daniel', spanish: 'Daniel', abbreviation: 'DAN', chapters: 12, testament: 'Old' },
  { english: 'Hosea', spanish: 'Oseas', abbreviation: 'HOS', chapters: 14, testament: 'Old' },
  { english: 'Joel', spanish: 'Joel', abbreviation: 'JOL', chapters: 3, testament: 'Old' },
  { english: 'Amos', spanish: 'Amós', abbreviation: 'AMO', chapters: 9, testament: 'Old' },
  { english: 'Obadiah', spanish: 'Abdías', abbreviation: 'OBA', chapters: 1, testament: 'Old' },
  { english: 'Jonah', spanish: 'Jonás', abbreviation: 'JON', chapters: 4, testament: 'Old' },
  { english: 'Micah', spanish: 'Miqueas', abbreviation: 'MIC', chapters: 7, testament: 'Old' },
  { english: 'Nahum', spanish: 'Nahúm', abbreviation: 'NAH', chapters: 3, testament: 'Old' },
  { english: 'Habakkuk', spanish: 'Habacuc', abbreviation: 'HAB', chapters: 3, testament: 'Old' },
  { english: 'Zephaniah', spanish: 'Sofonías', abbreviation: 'ZEP', chapters: 3, testament: 'Old' },
  { english: 'Haggai', spanish: 'Hageo', abbreviation: 'HAG', chapters: 2, testament: 'Old' },
  { english: 'Zechariah', spanish: 'Zacarías', abbreviation: 'ZEC', chapters: 14, testament: 'Old' },
  { english: 'Malachi', spanish: 'Malaquías', abbreviation: 'MAL', chapters: 4, testament: 'Old' },
  
  // New Testament
  { english: 'Matthew', spanish: 'Mateo', abbreviation: 'MAT', chapters: 28, testament: 'New' },
  { english: 'Mark', spanish: 'Marcos', abbreviation: 'MRK', chapters: 16, testament: 'New' },
  { english: 'Luke', spanish: 'Lucas', abbreviation: 'LUK', chapters: 24, testament: 'New' },
  { english: 'John', spanish: 'Juan', abbreviation: 'JHN', chapters: 21, testament: 'New' },
  { english: 'Acts', spanish: 'Hechos', abbreviation: 'ACT', chapters: 28, testament: 'New' },
  { english: 'Romans', spanish: 'Romanos', abbreviation: 'ROM', chapters: 16, testament: 'New' },
  { english: '1 Corinthians', spanish: '1 Corintios', abbreviation: '1CO', chapters: 16, testament: 'New' },
  { english: '2 Corinthians', spanish: '2 Corintios', abbreviation: '2CO', chapters: 13, testament: 'New' },
  { english: 'Galatians', spanish: 'Gálatas', abbreviation: 'GAL', chapters: 6, testament: 'New' },
  { english: 'Ephesians', spanish: 'Efesios', abbreviation: 'EPH', chapters: 6, testament: 'New' },
  { english: 'Philippians', spanish: 'Filipenses', abbreviation: 'PHL', chapters: 4, testament: 'New' },
  { english: 'Colossians', spanish: 'Colosenses', abbreviation: 'COL', chapters: 4, testament: 'New' },
  { english: '1 Thessalonians', spanish: '1 Tesalonicenses', abbreviation: '1TH', chapters: 5, testament: 'New' },
  { english: '2 Thessalonians', spanish: '2 Tesalonicenses', abbreviation: '2TH', chapters: 3, testament: 'New' },
  { english: '1 Timothy', spanish: '1 Timoteo', abbreviation: '1TI', chapters: 6, testament: 'New' },
  { english: '2 Timothy', spanish: '2 Timoteo', abbreviation: '2TI', chapters: 4, testament: 'New' },
  { english: 'Titus', spanish: 'Tito', abbreviation: 'TIT', chapters: 3, testament: 'New' },
  { english: 'Philemon', spanish: 'Filemón', abbreviation: 'PHM', chapters: 1, testament: 'New' },
  { english: 'Hebrews', spanish: 'Hebreos', abbreviation: 'HEB', chapters: 13, testament: 'New' },
  { english: 'James', spanish: 'Santiago', abbreviation: 'JAS', chapters: 5, testament: 'New' },
  { english: '1 Peter', spanish: '1 Pedro', abbreviation: '1PE', chapters: 5, testament: 'New' },
  { english: '2 Peter', spanish: '2 Pedro', abbreviation: '2PE', chapters: 3, testament: 'New' },
  { english: '1 John', spanish: '1 Juan', abbreviation: '1JN', chapters: 5, testament: 'New' },
  { english: '2 John', spanish: '2 Juan', abbreviation: '2JN', chapters: 1, testament: 'New' },
  { english: '3 John', spanish: '3 Juan', abbreviation: '3JN', chapters: 1, testament: 'New' },
  { english: 'Jude', spanish: 'Judas', abbreviation: 'JUD', chapters: 1, testament: 'New' },
  { english: 'Revelation', spanish: 'Apocalipsis', abbreviation: 'REV', chapters: 22, testament: 'New' },
];

/**
 * Get book name in the specified language
 */
export function getBookName(englishName: string, language: string): string {
  const mapping = BOOK_NAME_MAPPINGS.find(book => book.english === englishName);
  if (!mapping) return englishName;
  
  switch (language.toLowerCase()) {
    case 'spanish':
    case 'español':
      return mapping.spanish;
    case 'english':
    default:
      return mapping.english;
  }
}

/**
 * Get English book name from any language
 */
export function getEnglishBookName(bookName: string, fromLanguage: string): string {
  if (fromLanguage.toLowerCase() === 'english') {
    return bookName;
  }
  
  if (fromLanguage.toLowerCase() === 'spanish' || fromLanguage.toLowerCase() === 'español') {
    const mapping = BOOK_NAME_MAPPINGS.find(book => book.spanish === bookName);
    return mapping ? mapping.english : bookName;
  }
  
  return bookName;
}

/**
 * Get books for display in the specified language
 */
export function getBooksForLanguage(language: string) {
  return BOOK_NAME_MAPPINGS.map(mapping => {
    const name = getBookName(mapping.english, language);
    return {
      name: name,
      // Only set englishName if it's different from name (non-English language)
      englishName: language.toLowerCase() !== 'english' ? mapping.english : undefined,
      abbreviation: mapping.abbreviation,
      chapters: mapping.chapters,
      testament: mapping.testament,
    };
  });
}

/**
 * Get Old Testament books for the specified language
 */
export function getOldTestamentBooks(language: string) {
  return getBooksForLanguage(language).filter(book => book.testament === 'Old');
}

/**
 * Get New Testament books for the specified language
 */
export function getNewTestamentBooks(language: string) {
  return getBooksForLanguage(language).filter(book => book.testament === 'New');
}

/**
 * Convert book name from UI language to Bible JSON key
 */
export function getBookKeyForBible(displayName: string, uiLanguage: string, bibleLanguage: string): string {
  // First, get the English name from the display name
  const englishName = getEnglishBookName(displayName, uiLanguage);
  
  // Then convert to the target Bible language
  return getBookName(englishName, bibleLanguage);
}
