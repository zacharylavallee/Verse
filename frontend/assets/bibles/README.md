# Bible Translations Directory Structure

This directory contains Bible translations with both metadata and full Bible text organized by language and translation version.

## Current Structure

```
assets/bibles/
├── English/
│   ├── ESV/
│   │   ├── metadata.json
│   │   └── esv.json (full Bible text)
│   ├── NKJV/
│   │   ├── metadata.json
│   │   └── nkjv.json (full Bible text)
│   └── NASB1995/
│       ├── metadata.json
│       └── nasb1995.json (full Bible text)
├── Spanish/
│   └── RVR1960/
│       ├── metadata.json
│       └── rvr1960.json (full Bible text)
└── README.md (this file)
```

## How It Works

1. **Dynamic Detection**: The app scans the folder structure to find available translations
2. **Context Integration**: Translation selection is managed globally via React Context
3. **Real-time Loading**: Bible text loads dynamically when users change translations
4. **Automatic UI Updates**: Language and translation dropdowns populate based on available files

## Adding New Translations

To add a new Bible translation:

1. **Create Directory Structure**:
   ```
   assets/bibles/{Language}/{Translation}/
   ```

2. **Add Metadata File** (`metadata.json`):
   ```json
   {
     "name": "Full Translation Name",
     "abbreviation": "ABBR",
     "language": "Language",
     "year": 2000,
     "description": "Description of the translation",
     "copyright": "Copyright information",
     "publisher": "Publisher name"
   }
   ```

3. **Add Bible Text File** (`{translation}.json`):
   ```json
   {
     "Genesis": {
       "1": {
         "1": "In the beginning God created the heavens and the earth.",
         "2": "The earth was without form, and void..."
       }
     }
   }
   ```

4. **Update Static Imports** in `utils/bibleLoader.ts`:
   ```typescript
   // Add your translation import
   const yourTranslation = require('@/assets/bibles/Language/Translation/translation.json');
   
   // Add to the translations object
   const translations = {
     // ... existing translations
     Language: {
       Translation: yourTranslation
     }
   };
   ```

## Bible Text Format

Bible text files use a nested JSON structure:
- **Book Level**: Book names as keys (e.g., "Genesis", "Matthew")
- **Chapter Level**: Chapter numbers as string keys (e.g., "1", "2")
- **Verse Level**: Verse numbers as string keys with text as values

```json
{
  "Genesis": {
    "1": {
      "1": "In the beginning God created the heavens and the earth.",
      "2": "The earth was without form, and void; and darkness was on the face of the deep."
    },
    "2": {
      "1": "Thus the heavens and the earth, and all the host of them, were finished."
    }
  },
  "Matthew": {
    "1": {
      "1": "The book of the genealogy of Jesus Christ, the Son of David, the Son of Abraham:"
    }
  }
}
```

## Integration Features

- **Global State Management**: Translation selection managed via `BibleContext`
- **Header Integration**: Dropdown selections automatically update Bible text
- **Verse Reading**: Full chapter and verse navigation with selected translation
- **Loading States**: Smooth loading indicators during translation switches
- **Error Handling**: Graceful fallbacks if translations fail to load

## Technical Notes

- Bible text files are statically imported to satisfy React Native bundler requirements
- Translation detection happens at app startup via `bibleScanner.ts`
- Context provides real-time translation state to all components
- Supports both metadata-only and full-text translations

## Currently Available Translations

- **English**: ESV, NKJV, NASB1995
- **Spanish**: RVR1960
