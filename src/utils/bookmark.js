export const saveBookmark = (verse) => {
  try {
    const bookmarks = getBookmarks();
    
    const exists = bookmarks.some(
      b => b.surahNumber === verse.surahNumber && b.ayahNumber === verse.ayahNumber
    );
    
    if (!exists) {
      bookmarks.push({
        ...verse,
        timestamp: new Date().toISOString(), // Add timestamp
        surahNumber: verse.surahNumber,
        ayahNumber: verse.ayahNumber,
        surahName: verse.surahName,
        text: verse.text,
        translation: verse.translation,
        verseKey: verse.verseKey
      });
      
      localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving bookmark:', error);
    return false;
  }
};

/**
 * Removes a verse from bookmarks
 * @param {number} surahNumber - The surah number
 * @param {number} ayahNumber - The ayah number
 */
export const removeBookmark = (surahNumber, ayahNumber) => {
  // Get existing bookmarks
  let bookmarks = getBookmarks();
  
  // Filter out the specific bookmark
  bookmarks = bookmarks.filter(
    item => !(item.surahNumber === surahNumber && item.ayahNumber === ayahNumber)
  );
  
  // Save updated bookmarks
  localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
};

/**
 * Get all saved bookmarks
 * @returns {Array} Array of bookmark objects
 */
export const getBookmarks = () => {
  try {
    const bookmarks = localStorage.getItem('quran-bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

/**
 * Check if a verse is bookmarked
 * @param {number} surahNumber - The surah number
 * @param {number} ayahNumber - The ayah number
 * @returns {boolean} True if bookmarked, false otherwise
 */
export const isVerseBookmarked = (surahNumber, ayahNumber) => {
  const bookmarks = getBookmarks();
  return bookmarks.some(
    item => item.surahNumber === surahNumber && item.ayahNumber === ayahNumber
  );
};

// Add new function to clear all bookmarks
export const clearAllBookmarks = () => {
  try {
    localStorage.setItem('quran-bookmarks', JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing bookmarks:', error);
    return false;
  }
};