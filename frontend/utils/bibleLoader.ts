// Bible text loading utilities
export interface BibleData {
  [bookName: string]: {
    [chapter: string]: {
      [verse: string]: string;
    };
  };
}

// Registry of Bible text files with static imports
const BIBLE_TEXT_REGISTRY = {
  'English/NKJV': () => require('../assets/bibles/English/NKJV/nkjv.json'),
  'English/ESV': () => require('../assets/bibles/English/ESV/esv.json'),
  'English/NASB1995': () => require('../assets/bibles/English/NASB1995/nasb1995.json'),
  'Spanish/RVR1960': () => require('../assets/bibles/Spanish/RVR1960/rvr1960.json'),
};

export async function loadBibleText(language: string, translation: string): Promise<BibleData | null> {
  try {
    const key = `${language}/${translation}`;
    const loader = BIBLE_TEXT_REGISTRY[key as keyof typeof BIBLE_TEXT_REGISTRY];
    
    if (!loader) {
      console.warn(`No Bible text found for ${key}`);
      return null;
    }
    
    const bibleData = loader();
    return bibleData;
  } catch (error) {
    console.error(`Failed to load Bible text for ${language}/${translation}:`, error);
    return null;
  }
}

/**
 * Normalize a book key for case-insensitive and accent-insensitive comparison
 * This helps with matching book names across different languages and formats
 */
export function normalizeBookKey(key: string): string {
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritical marks (accents)
}

/**
 * Common Bible book name variations that need special handling
 */
const BOOK_NAME_VARIATIONS: { [key: string]: string[] } = {
  'psalms': ['psalm', 'psalms'],
  'psalm': ['psalm', 'psalms'],
  'song of solomon': ['song of solomon', 'song of songs', 'canticles'],
  'song of songs': ['song of solomon', 'song of songs', 'canticles'],
  'canticles': ['song of solomon', 'song of songs', 'canticles'],
  '1 samuel': ['1 samuel', '1samuel', 'first samuel'],
  '2 samuel': ['2 samuel', '2samuel', 'second samuel'],
  '1 kings': ['1 kings', '1kings', 'first kings'],
  '2 kings': ['2 kings', '2kings', 'second kings'],
  '1 chronicles': ['1 chronicles', '1chronicles', 'first chronicles'],
  '2 chronicles': ['2 chronicles', '2chronicles', 'second chronicles'],
  '1 corinthians': ['1 corinthians', '1corinthians', 'first corinthians'],
  '2 corinthians': ['2 corinthians', '2corinthians', 'second corinthians'],
  '1 thessalonians': ['1 thessalonians', '1thessalonians', 'first thessalonians'],
  '2 thessalonians': ['2 thessalonians', '2thessalonians', 'second thessalonians'],
  '1 timothy': ['1 timothy', '1timothy', 'first timothy'],
  '2 timothy': ['2 timothy', '2timothy', 'second timothy'],
  '1 peter': ['1 peter', '1peter', 'first peter'],
  '2 peter': ['2 peter', '2peter', 'second peter'],
  '1 john': ['1 john', '1john', 'first john'],
  '2 john': ['2 john', '2john', 'second john'],
  '3 john': ['3 john', '3john', 'third john'],
};

/**
 * Find the correct book key in the Bible data, handling accents, case differences, and common variations
 */
export function findBookKey(bibleData: BibleData, bookKey: string): string | null {
  // Direct match
  if (bibleData[bookKey]) {
    return bookKey;
  }
  
  // Normalize the search key
  const normalizedSearchKey = normalizeBookKey(bookKey);
  
  // Check for exact normalized matches first
  for (const key of Object.keys(bibleData)) {
    if (normalizeBookKey(key) === normalizedSearchKey) {
      return key;
    }
  }
  
  // Check for common book name variations
  const variations = BOOK_NAME_VARIATIONS[normalizedSearchKey] || [];
  for (const variation of variations) {
    for (const key of Object.keys(bibleData)) {
      if (normalizeBookKey(key) === normalizeBookKey(variation)) {
        return key;
      }
    }
  }
  
  // Look for partial matches as fallback
  for (const key of Object.keys(bibleData)) {
    if (normalizeBookKey(key).includes(normalizedSearchKey) || 
        normalizedSearchKey.includes(normalizeBookKey(key))) {
      return key;
    }
  }
  
  return null;
}

export function getChapterText(bibleData: BibleData, bookName: string, chapter: number): Array<{verse: number, text: string}> {
  // Find the correct book key in the Bible data
  const actualBookKey = findBookKey(bibleData, bookName);
  
  if (!actualBookKey) {
    console.error(`Could not find book "${bookName}" in Bible data`);
    return [];
  }
  
  if (!bibleData[actualBookKey]) {
    console.error(`Book "${actualBookKey}" not found in Bible data`);
    return [];
  }
  
  if (!bibleData[actualBookKey][chapter.toString()]) {
    console.error(`Chapter ${chapter} not found in book "${actualBookKey}"`);
    return [];
  }
  
  const chapterData = bibleData[actualBookKey][chapter.toString()];
  const verses = Object.keys(chapterData)
    .map(verseNum => ({
      verse: parseInt(verseNum),
      text: chapterData[verseNum]
    }))
    .sort((a, b) => a.verse - b.verse);
    
  return verses;
}
