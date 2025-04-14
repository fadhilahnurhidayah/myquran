export const saveBookmark = (verse) => {
  try {
    const bookmarks = getBookmarks();
    
    const exists = bookmarks.some(
      b => b.surahNumber === verse.surahNumber && b.ayahNumber === verse.ayahNumber
    );
    
    if (!exists) {
      bookmarks.push({
        ...verse,
        timestamp: new Date().toISOString(), 
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

export const removeBookmark = (surahNumber, ayahNumber) => {
  let bookmarks = getBookmarks();
  
  bookmarks = bookmarks.filter(
    item => !(item.surahNumber === surahNumber && item.ayahNumber === ayahNumber)
  );
  
  localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
};

export const getBookmarks = () => {
  try {
    const bookmarks = localStorage.getItem('quran-bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

export const isVerseBookmarked = (surahNumber, ayahNumber) => {
  const bookmarks = getBookmarks();
  return bookmarks.some(
    item => item.surahNumber === surahNumber && item.ayahNumber === ayahNumber
  );
};
