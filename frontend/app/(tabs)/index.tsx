import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useBible } from '@/contexts/BibleContext';
import { loadBibleText, getChapterText, findBookKey, BibleData } from '@/utils/bibleLoader';
import { BibleBook } from '@/types/bible';
import { getOldTestamentBooks, getNewTestamentBooks, getBookKeyForBible, getEnglishBookName, BOOK_NAME_MAPPINGS } from '@/utils/bookNameMapping';

type BrowseMode = 'books' | 'chapters' | 'verse-numbers' | 'verses';

interface BrowseState {
  mode: BrowseMode;
  selectedBook?: BibleBook;
  selectedChapter?: number;
  selectedVerse?: number;
}

export default function BibleScreen() {
  const { selectedLanguage, selectedTranslation } = useBible();
  
  const [browseState, setBrowseState] = useState<BrowseState>({
    mode: 'books'
  });
  
  const [bibleData, setBibleData] = useState<BibleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verses, setVerses] = useState<Array<{verse: number, text: string}>>([]);
  
  // Create refs for ScrollView and verse elements
  const scrollViewRef = useRef<ScrollView | null>(null);
  const verseRefs = useRef<{[key: number]: any}>({});
  
  // Animation values for verse selection
  const verseAnimations = useRef<{[key: number]: Animated.Value}>({});
  
  // Helper function to animate verse selection with staggered effect
  const animateVerseSelection = (verseNumbers: number[], staggered: boolean = false) => {
    verseNumbers.forEach((verseNumber, index) => {
      // Create animation value if it doesn't exist
      if (!verseAnimations.current[verseNumber]) {
        verseAnimations.current[verseNumber] = new Animated.Value(1);
      }
      
      // Stagger the animations slightly for a wave effect if staggered is true
      const delay = staggered ? index * 20 : 0; // 20ms delay between each verse animation if staggered
      
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(verseAnimations.current[verseNumber], {
            toValue: 1.05, // Scale up slightly
            duration: 120,
            useNativeDriver: true
          }),
          Animated.timing(verseAnimations.current[verseNumber], {
            toValue: 1, // Scale back to normal
            duration: 100,
            useNativeDriver: true
          })
        ]).start();
      }, delay);
    });
  };
  
  // State for tracking multiple selected verses
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
  
  // We no longer reset the view when language changes
  // This allows users to stay on the same chapter/verse when switching languages
  
  // Load Bible text when translation changes
  useEffect(() => {
    const loadBible = async () => {
      setIsLoading(true);
      try {
        const data = await loadBibleText(selectedLanguage, selectedTranslation);
        setBibleData(data);
      } catch (error) {
        console.error('Failed to load Bible text:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBible();
  }, [selectedLanguage, selectedTranslation]);
  
  // Track previous language to detect changes
  const prevLanguageRef = useRef(selectedLanguage);
  
  // Handle language changes separately from verse loading
  useEffect(() => {
    // Only run this effect when language changes
    const languageChanged = prevLanguageRef.current !== selectedLanguage;
    if (!languageChanged) {
      prevLanguageRef.current = selectedLanguage;
      return;
    }
    
    prevLanguageRef.current = selectedLanguage;
    
    // If we're viewing verses or chapters, update the book name in the current language
    if (browseState.selectedBook?.englishName && (browseState.mode === 'verses' || browseState.mode === 'chapters')) {
      // Find the same book in the new language using the englishName as reference
      const allBooks = [...getOldTestamentBooks(selectedLanguage), ...getNewTestamentBooks(selectedLanguage)];
      const matchingBook = allBooks.find(book => 
        book.englishName === browseState.selectedBook?.englishName || 
        book.name === browseState.selectedBook?.englishName
      );
      
      // If we found a matching book, update the state with the localized version
      if (matchingBook) {
        // Keep the same mode and chapter, just update the book
        setBrowseState(prev => ({
          ...prev,
          selectedBook: matchingBook
        }));
      }
    }
  }, [selectedLanguage]);
  
  // Load verses when book and chapter are selected
  useEffect(() => {
    if (bibleData && browseState.selectedBook && browseState.selectedChapter) {
      // Get the English name of the book for consistent lookup
      const englishName = browseState.selectedBook.englishName || 
                         getEnglishBookName(browseState.selectedBook.name, selectedLanguage);
      
      // Find the correct book key for the Bible data based on the language of the Bible text
      // This ensures we're using the right key format for the JSON structure
      let bibleBookKey;
      
      // For Spanish Bible JSON, the keys are in Spanish format
      if (selectedTranslation === 'RVR1960') {
        const bookMapping = BOOK_NAME_MAPPINGS.find(book => 
          book.english === englishName || (browseState.selectedBook && book.spanish === browseState.selectedBook.name)
        );
        bibleBookKey = bookMapping ? bookMapping.spanish : (browseState.selectedBook?.name || englishName);
      } 
      // For English Bible JSON, the keys are in English format
      else {
        const bookMapping = BOOK_NAME_MAPPINGS.find(book => 
          book.english === englishName || (browseState.selectedBook && book.english === browseState.selectedBook.name)
        );
        bibleBookKey = bookMapping ? bookMapping.english : (browseState.selectedBook?.name || englishName);
      }
      
      // Enhanced debugging for Bible text loading
      console.log('Loading verses for:', { 
        bookName: browseState.selectedBook.name, 
        englishName, 
        bibleBookKey, 
        language: selectedLanguage,
        translation: selectedTranslation,
        chapter: browseState.selectedChapter,
        availableKeys: bibleData ? Object.keys(bibleData).slice(0, 5) : [] // Show first 5 keys for debugging
      });
      
      // Use the enhanced findBookKey function to handle book name variations
      // This will automatically handle cases like "Psalms" vs "Psalm"
      const chapterVerses = getChapterText(bibleData, bibleBookKey, browseState.selectedChapter);
      setVerses(chapterVerses);
      
      // Initialize animation values for all verses
      const newAnimations: {[key: number]: Animated.Value} = {};
      chapterVerses.forEach(verse => {
        newAnimations[verse.verse] = new Animated.Value(1);
      });
      verseAnimations.current = newAnimations;
    }
  }, [bibleData, browseState.selectedBook, browseState.selectedChapter, selectedLanguage, selectedTranslation]);
  




  const handleBookSelect = (book: BibleBook) => {
    // Ensure we have the correct book for the current language
    const bookWithLanguage = {
      ...book,
      // If not in English, ensure we have the English name for reference
      englishName: selectedLanguage !== 'English' && !book.englishName ? 
        getEnglishBookName(book.name, selectedLanguage) : 
        book.englishName || book.name
    };
    
    setBrowseState({
      mode: 'chapters',
      selectedBook: bookWithLanguage
    });
  };

  const handleChapterSelect = (chapter: number) => {
    if (browseState.selectedBook) {
      // Ensure we have the correct book for the current language
      const currentBook = browseState.selectedBook;
      const bookWithLanguage = {
        ...currentBook,
        // If not in English, ensure we have the English name for reference
        englishName: selectedLanguage !== 'English' && !currentBook.englishName ? 
          getEnglishBookName(currentBook.name, selectedLanguage) : 
          currentBook.englishName || currentBook.name
      };
      
      setBrowseState({
        mode: 'verse-numbers',
        selectedBook: bookWithLanguage,
        selectedChapter: chapter
      });
    }
  };
  
  const handleVerseNumberSelect = (verse: number) => {
    if (browseState.selectedBook && browseState.selectedChapter) {
      // Ensure we have the correct book for the current language
      const currentBook = browseState.selectedBook;
      const bookWithLanguage = {
        ...currentBook,
        // If not in English, ensure we have the English name for reference
        englishName: selectedLanguage !== 'English' && !currentBook.englishName ? 
          getEnglishBookName(currentBook.name, selectedLanguage) : 
          currentBook.englishName || currentBook.name
      };
      
      setBrowseState({
        mode: 'verses',
        selectedBook: bookWithLanguage,
        selectedChapter: browseState.selectedChapter,
        selectedVerse: verse
      });
    }
  };
  
  const handleVerseSelect = (verse: number) => {
    // Handle verse highlighting toggle - no navigation, no screen movement
    console.log('Toggling verse selection:', verse);
    
    // Create animation value for this verse if it doesn't exist
    if (!verseAnimations.current[verse]) {
      verseAnimations.current[verse] = new Animated.Value(1);
    }
    
    // Animate the verse selection with subtle feedback
    Animated.sequence([
      Animated.timing(verseAnimations.current[verse], {
        toValue: 1.02, // Smaller scale for subtle feedback
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(verseAnimations.current[verse], {
        toValue: 1, // Scale back to normal
        duration: 80,
        useNativeDriver: true
      })
    ]).start();
    
    // Toggle verse selection in the multi-select array
    setSelectedVerses(prevSelectedVerses => {
      if (prevSelectedVerses.includes(verse)) {
        // Remove verse if already selected (unhighlight)
        return prevSelectedVerses.filter(v => v !== verse);
      } else {
        // Add verse if not already selected (highlight)
        return [...prevSelectedVerses, verse];
      }
    });
    
    // Do NOT update browseState.selectedVerse to prevent screen movement for tap-to-highlight
  };



  const handleBack = () => {
  console.log('handleBack called, current mode:', browseState.mode);
  
  // Clear selected verses when navigating away from verses view
  if (browseState.mode === 'verses') {
    setSelectedVerses([]);
  }
  
  if (browseState.mode === 'verses' && browseState.selectedBook && browseState.selectedChapter && browseState.selectedVerse) {
    console.log('Going back from verses with selected verse to verse numbers view');
    // Go back to verse numbers view from verses with selected verse
    setBrowseState(prevState => {
      const newState: BrowseState = {
        mode: 'verse-numbers',
        selectedBook: prevState.selectedBook,
        selectedChapter: prevState.selectedChapter,
        selectedVerse: prevState.selectedVerse
      };
      console.log('New state after back:', newState);
      return newState;
    });
  } else if (browseState.mode === 'verses' && browseState.selectedBook) {
    console.log('Going back from verses to verse numbers view');
    // Go back to verse numbers view
    setBrowseState(prevState => {
      const newState: BrowseState = {
        mode: 'verse-numbers',
        selectedBook: prevState.selectedBook,
        selectedChapter: prevState.selectedChapter
      };
      console.log('New state after back:', newState);
      return newState;
    });
  } else if (browseState.mode === 'verse-numbers' && browseState.selectedBook) {
    console.log('Going back from verse numbers to chapters view');
    // Go back to chapters view
    setBrowseState(prevState => {
      const newState: BrowseState = {
        mode: 'chapters',
        selectedBook: prevState.selectedBook
      };
      console.log('New state after back:', newState);
      return newState;
    });
  } else if (browseState.mode === 'chapters') {
    console.log('Going back from chapters to books view');
    setBrowseState({
      mode: 'books'
    });
  }
};

  const renderBooks = () => {
    // Get books in the correct language
    const oldTestamentBooks = getOldTestamentBooks(selectedLanguage);
    const newTestamentBooks = getNewTestamentBooks(selectedLanguage);
    
    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.testamentsContainer}>
            {/* Old Testament Column */}
            <View style={styles.testamentColumn}>
              {oldTestamentBooks.map((book: BibleBook) => (
                <TouchableOpacity
                  key={book.name}
                  style={styles.bookButton}
                  onPress={() => handleBookSelect(book)}
                >
                  <Text style={styles.bookName}>{book.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* New Testament Column */}
            <View style={styles.testamentColumn}>
              {newTestamentBooks.map((book: BibleBook) => (
                <TouchableOpacity
                  key={book.name}
                  style={styles.bookButton}
                  onPress={() => handleBookSelect(book)}
                >
                  <Text style={styles.bookName}>{book.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderChapters = () => {
    if (!browseState.selectedBook) return null;
    
    // When language changes, we need to find the correct localized book name
    let displayBook = browseState.selectedBook;
    
    // If we have an englishName property, use it to find the correct book in the current language
    if (browseState.selectedBook?.englishName) {
      const allBooks = [...getOldTestamentBooks(selectedLanguage), ...getNewTestamentBooks(selectedLanguage)];
      const matchingBook = allBooks.find(book => 
        book.englishName === browseState.selectedBook?.englishName || 
        book.name === browseState.selectedBook?.englishName
      );
      
      if (matchingBook) {
        displayBook = matchingBook;
      }
    }
    
    const chapters = Array.from({ length: browseState.selectedBook.chapters }, (_, i) => i + 1);
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>← {selectedLanguage === 'Spanish' ? 'Atrás' : 'Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{displayBook.name}</Text>
          <View style={{width: 80}} />
        </View>
        
        <ScrollView ref={scrollViewRef} style={styles.scrollView}>
          <View style={styles.chaptersGrid}>
            {chapters.map((chapter) => (
              <TouchableOpacity
                key={chapter}
                style={styles.chapterItem}
                onPress={() => handleChapterSelect(chapter)}
              >
                <Text style={styles.chapterNumber}>{chapter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };
  
  // Effect to scroll to the selected verse after render - only for direct navigation, not tap-to-highlight
  useEffect(() => {
    if (browseState.mode === 'verses' && browseState.selectedVerse && scrollViewRef.current) {
      // Highlight the directly navigated verse
      setSelectedVerses(prevSelectedVerses => {
        if (!prevSelectedVerses.includes(browseState.selectedVerse!)) {
          return [...prevSelectedVerses, browseState.selectedVerse!];
        }
        return prevSelectedVerses;
      });
      
      // Small delay to ensure the view has rendered
      setTimeout(() => {
        if (verseRefs.current[browseState.selectedVerse!]) {
          verseRefs.current[browseState.selectedVerse!].measure((_x: number, y: number) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          });
        }
      }, 100);
    }
  }, [browseState.selectedVerse, browseState.mode]);

  // Effect to scroll to top when navigating back to different modes
  useEffect(() => {
    console.log('Mode changed to:', browseState.mode);
    if (browseState.mode === 'books' || browseState.mode === 'chapters' || browseState.mode === 'verse-numbers') {
      console.log('Attempting to scroll to top for mode:', browseState.mode);
      
      // Try immediate scroll first
      if (scrollViewRef.current) {
        console.log('ScrollView ref exists immediately, scrolling to top');
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      } else {
        // If ref not available immediately, try with minimal delays
        console.log('ScrollView ref not available immediately, trying with short delays');
        setTimeout(() => {
          if (scrollViewRef.current) {
            console.log('ScrollView ref found after short delay, scrolling to top');
            scrollViewRef.current.scrollTo({ y: 0, animated: false });
          }
        }, 50); // Much shorter delay
      }
    }
  }, [browseState.mode]);

  const renderVerses = () => {
    if (!browseState.selectedBook || !browseState.selectedChapter) return null;
    
    // When language changes, we need to find the correct localized book name
    let displayBook = browseState.selectedBook;
    
    // If we have an englishName property, use it to find the correct book in the current language
    if (browseState.selectedBook?.englishName) {
      const allBooks = [...getOldTestamentBooks(selectedLanguage), ...getNewTestamentBooks(selectedLanguage)];
      const matchingBook = allBooks.find(book => 
        book.englishName === browseState.selectedBook?.englishName || 
        book.name === browseState.selectedBook?.englishName
      );
      
      if (matchingBook) {
        displayBook = matchingBook;
      }
    }
    
    const title = `${displayBook.name} ${browseState.selectedChapter}`;
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backText}>← {selectedLanguage === 'Spanish' ? 'Atrás' : 'Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={{width: 80}} />
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{selectedLanguage === 'Spanish' ? 'Cargando versículos...' : 'Loading verses...'}</Text>
          </View>
        ) : (
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView} 
            contentContainerStyle={styles.versesContent}
            showsVerticalScrollIndicator={true}
          >
            {selectedVerses.length > 0 && (
              <View style={styles.floatingActionButton}>
                <TouchableOpacity 
                  style={styles.saveSelectionButton}
                  onPress={() => {
                    // Handle saving the selected verses
                    console.log('Saving selected verses:', selectedVerses);
                    
                    // Create a verse group with the selected verses
                    if (browseState.selectedBook && browseState.selectedChapter) {
                      const bookName = browseState.selectedBook.name;
                      const chapterNum = browseState.selectedChapter;
                      const verseCount = selectedVerses.length;
                      
                      // Show confirmation dialog
                      if (confirm(`Save ${verseCount} ${verseCount === 1 ? 'verse' : 'verses'} from ${bookName} ${chapterNum} as favorites?`)) {
                        // Format the selected verses for saving
                        const verseGroup = {
                          id: `${Date.now()}`, // Unique ID based on timestamp
                          bookName,
                          englishBookName: browseState.selectedBook.englishName || bookName,
                          chapterNumber: chapterNum,
                          verses: selectedVerses,
                          translation: selectedTranslation,
                          language: selectedLanguage,
                          dateAdded: new Date().toISOString()
                        };
                        
                        // Here you would save to AsyncStorage or your backend
                        console.log('Verse group to save:', verseGroup);
                        
                        // Show success message
                        alert(`${verseCount} ${verseCount === 1 ? 'verse' : 'verses'} saved as favorites!`);
                        
                        // Clear selection after saving
                        setSelectedVerses([]);
                      }
                    }
                  }}
                >
                  <Text style={styles.saveSelectionText}>
                    Save {selectedVerses.length} {selectedVerses.length === 1 ? 'verse' : 'verses'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {verses.length > 0 ? (
              verses.map((verseData) => (
                <TouchableOpacity 
                  key={verseData.verse} 
                  ref={ref => {
                    if (ref) {
                      verseRefs.current[verseData.verse] = ref;
                    }
                  }}
                  onPress={() => handleVerseSelect(verseData.verse)}
                >
                  <Animated.View 
                    style={[
                      styles.verseContainer, 
                      selectedVerses.includes(verseData.verse) ? styles.selectedVerseContainer : null,
                      { transform: [{ scale: verseAnimations.current[verseData.verse] || 1 }] }
                    ]}
                  >
                  <Text style={styles.verseNumber}>{verseData.verse}</Text>
                  <Text style={[styles.verseText, 
                    selectedVerses.includes(verseData.verse) ? styles.selectedVerseText : null
                  ]}>{verseData.text}</Text>
                  </Animated.View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noVersesContainer}>
                <Text style={styles.noVersesText}>
                  {selectedLanguage === 'Spanish' 
                    ? 'No se pudieron cargar los versículos.' 
                    : 'Could not load verses.'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderVerseDetail = () => {
    if (!browseState.selectedBook || !browseState.selectedChapter || !browseState.selectedVerse) {
      return renderVerses();
    }
    
    // When language changes, we need to find the correct localized book name
    let displayBook = browseState.selectedBook;
    
    // If we have an englishName property, use it to find the correct book in the current language
    if (browseState.selectedBook?.englishName) {
      const allBooks = [...getOldTestamentBooks(selectedLanguage), ...getNewTestamentBooks(selectedLanguage)];
      const matchingBook = allBooks.find(book => 
        book.englishName === browseState.selectedBook?.englishName || 
        book.name === browseState.selectedBook?.englishName
      );
      
      if (matchingBook) {
        displayBook = matchingBook;
      }
    }
    
    // Find the selected verse
    const selectedVerseData = verses.find(v => v.verse === browseState.selectedVerse);
    if (!selectedVerseData) {
      return renderVerses();
    }
    
    const title = `${displayBook.name} ${browseState.selectedChapter}:${browseState.selectedVerse}`;
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backText}>← {selectedLanguage === 'Spanish' ? 'Atrás' : 'Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.verseDetailContainer}>
          <Text style={styles.verseDetailReference}>{title}</Text>
          <Text style={styles.verseDetailText}>{selectedVerseData.text}</Text>
          
          {/* Add verse actions here - like favorite, share, etc. */}
          <View style={styles.verseActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{selectedLanguage === 'Spanish' ? 'Favorito' : 'Favorite'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{selectedLanguage === 'Spanish' ? 'Compartir' : 'Share'}</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
};

const renderVerseNumbers = () => {
  if (!browseState.selectedBook || !browseState.selectedChapter) return null;
  
  // When language changes, we need to find the correct localized book name
  let displayBook = browseState.selectedBook;
  
  // If we have an englishName property, use it to find the correct book in the current language
  if (browseState.selectedBook?.englishName) {
    const allBooks = [...getOldTestamentBooks(selectedLanguage), ...getNewTestamentBooks(selectedLanguage)];
    const matchingBook = allBooks.find(book => 
      book.englishName === browseState.selectedBook?.englishName || 
      book.name === browseState.selectedBook?.englishName
    );
    
    if (matchingBook) {
      displayBook = matchingBook;
    }
  }
  
  const title = `${displayBook.name} ${browseState.selectedChapter}`;
  
  // Calculate the number of verses in this chapter
  let verseCount = 0;
  if (bibleData) {
    const bookKey = findBookKey(bibleData, displayBook.name);
    const chapterKey = String(browseState.selectedChapter);
    
    if (bookKey && bibleData[bookKey] && bibleData[bookKey][chapterKey]) {
      verseCount = Object.keys(bibleData[bookKey][chapterKey]).length;
    }
  }
  
  // Create an array of verse numbers
  const verseNumbers = Array.from({ length: verseCount }, (_, i) => i + 1);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>← {selectedLanguage === 'Spanish' ? 'Atrás' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={{width: 80}} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{selectedLanguage === 'Spanish' ? 'Cargando...' : 'Loading...'}</Text>
        </View>
      ) : (
        <ScrollView ref={scrollViewRef} style={styles.scrollView}>
          <View style={styles.chaptersGrid}>
            {verseNumbers.map((verse) => (
              <TouchableOpacity
                key={verse}
                style={styles.chapterItem}
                onPress={() => handleVerseNumberSelect(verse)}
              >
                <Text style={styles.chapterNumber}>{verse}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const renderContent = () => {
  if (isLoading && !bibleData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Bible...</Text>
      </View>
    );
  }

  switch (browseState.mode) {
    case 'books':
      return renderBooks();
    case 'chapters':
      return renderChapters();
    case 'verse-numbers':
      return renderVerseNumbers();
    case 'verses':
      return renderVerses();
    default:
      return renderBooks();
  }
};

return renderContent();
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    width: 60,
    alignItems: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  // Removed duplicate testamentTitle
  testamentsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  testamentColumn: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  testamentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 15,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#e9ecef',
    marginHorizontal: 5,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
  },
  bookName: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'flex-start',
  },
  chapterItem: {
    width: '21%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2%',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: '#495057',
  },
  // Verse reading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  versesContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  verseNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
    marginTop: 2,
    minWidth: 20,
    textAlign: 'right',
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'left',
  },
  noVersesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 50,
  },
  noVersesText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Verse detail view styles
  verseDetailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  verseDetailReference: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 16,
    textAlign: 'center',
  },
  verseDetailText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#212529',
    marginBottom: 30,
    textAlign: 'center',
  },
  verseActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedCount: {
    backgroundColor: '#4a90e2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  selectedCountText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  saveSelectionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveSelectionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  selectedVerseContainer: {
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  selectedVerseText: {
    fontWeight: '600',
  },
});
