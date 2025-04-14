import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { saveBookmark, isVerseBookmarked, removeBookmark } from '../utils/bookmark';

export default function SurahPage() {
  const [page, setPage] = useState(1);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [bookmarkedVerses, setBookmarkedVerses] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://api.quran.com/api/v4/verses/by_page/${page}?language=id&words=false&fields=text_uthmani,translations&translations=33`
        );
        const data = await res.json();
        setVerses(data.verses || []);
      } catch  {
        setError("Gagal memuat data ayat.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [page]);
  
  // Check if verses are bookmarked on component mount and verse changes
  useEffect(() => {
    if (verses.length > 0) {
      const bookmarked = {};
      verses.forEach(verse => {
        const [surahNumber, ayahNumber] = verse.verse_key.split(':');
        bookmarked[verse.verse_key] = isVerseBookmarked(parseInt(surahNumber), parseInt(ayahNumber));
      });
      setBookmarkedVerses(bookmarked);
    }
  }, [verses]);
  
  const handlePageInput = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= 604) setPage(val);
  };
  
  const toggleBookmark = (verse) => {
    const [surahNumber, ayahNumber] = verse.verse_key.split(':');
    const surahNum = parseInt(surahNumber);
    const ayahNum = parseInt(ayahNumber);
    
    if (bookmarkedVerses[verse.verse_key]) {
      // Remove bookmark
      removeBookmark(surahNum, ayahNum);
      setBookmarkedVerses(prev => ({
        ...prev,
        [verse.verse_key]: false
      }));
    } else {
      // Add bookmark
      const bookmarkData = {
        surahNumber: surahNum,
        ayahNumber: ayahNum,
        surahName: `${surahNum}`, // You may want to fetch the actual surah name
        text: verse.text_uthmani,
        translation: verse.translations?.[0]?.text.replace(/<[^>]+>/g, "") || "Terjemahan tidak tersedia."
      };
      
      saveBookmark(bookmarkData);
      setBookmarkedVerses(prev => ({
        ...prev,
        [verse.verse_key]: true
      }));
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const backgroundStyle = {
    backgroundImage: `url('/api/placeholder/1920/1080')`, // Replace with your actual background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundColor: 'rgba(247, 244, 228, 0.9)',
    backgroundBlendMode: darkMode ? 'overlay' : 'soft-light',
  };
  
  const cardStyle = darkMode 
    ? "bg-gray-800 bg-opacity-80 text-white border-gray-700" 
    : "bg-white bg-opacity-90 text-gray-800 border-[#D6C6AF]";
  
  return (
    <div 
      className={`min-h-screen font-nunito ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F7F4E4] text-gray-800'}`} 
      style={backgroundStyle}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 ${darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-[#9C7B4F] hover:text-[#7E5C3C]'} font-medium transition`}
          >
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </button>
          
          <button 
            onClick={toggleDarkMode} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-amber-300' : 'bg-amber-100 text-amber-800'}`}
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        <div className={`text-center relative z-10 py-4 px-6 rounded-xl mb-8 ${darkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white bg-opacity-70'} backdrop-blur-sm shadow-xl`}>
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-amber-400' : 'text-[#7D5A3C]'}`}>
           Halaman MyQuran
          </h1>
        </div>
        
        <div className={`max-w-md mx-auto p-5 rounded-lg shadow-lg mb-10 ${darkMode ? 'bg-gray-800 bg-opacity-90 border border-gray-700' : 'bg-[#F0E4D7] border border-[#D6C6AF]'}`}>
          <p className={`text-center ${darkMode ? 'text-amber-300' : 'text-[#7D5A3C]'} text-lg mb-3`}>
            <span className="font-arabic">صفحة</span>
            <span className="font-bold mx-2">{page}</span>
            <span className="text-sm">dari 604</span>
          </p>
          
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`${darkMode 
                ? 'bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600' 
                : 'bg-[#9C7B4F] hover:bg-[#7E5C3C] disabled:bg-gray-400'} 
                text-white px-4 py-2 rounded-md transition-all duration-200 shadow-md`}
            >
              ← Sebelumnya
            </button>
            
            <input
              type="number"
              value={page}
              onChange={handlePageInput}
              className={`w-16 ${darkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white text-gray-800 border-[#9C7B4F]'} 
                rounded px-2 py-1 text-center shadow-inner`}
              min={1}
              max={604}
            />
            
            <button
              onClick={() => setPage((p) => Math.min(604, p + 1))}
              disabled={page >= 604}
              className={`${darkMode 
                ? 'bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600' 
                : 'bg-[#9C7B4F] hover:bg-[#7E5C3C] disabled:bg-gray-400'} 
                text-white px-4 py-2 rounded-md transition-all duration-200 shadow-md`}
            >
              Berikutnya →
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-amber-400' : 'border-[#9C7B4F]'}`}></div>
            <p className={`ml-4 ${darkMode ? 'text-amber-400' : 'text-[#9C7B4F]'}`}>Memuat ayat-ayat suci...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center text-red-600 max-w-md mx-auto">
            {error}
          </div>
        ) : (
          <div className="space-y-6 w-full mx-auto">
            {verses.map((verse) => (
              <div 
                key={verse.id} 
                className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${cardStyle}`}
              >
                  <p className={`text-right text-[1.8rem] font-amiri leading-loose ${darkMode ? 'text-amber-200' : 'text-[#7D5A3C]'}`}>                  {verse.text_uthmani}
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3 opacity-50"></div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm ${darkMode ? 'text-amber-400' : 'text-[#9C7B4F]'} font-medium`}>
                    Surah {verse.verse_key}
                  </p>
                  <button
                    onClick={() => toggleBookmark(verse)}
                    title={bookmarkedVerses[verse.verse_key] ? "Hapus Bookmark" : "Tambah Bookmark"}
                    className={`${darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-[#F4A300] hover:text-[#FF8C00]'} focus:outline-none`}
                  >
                    {bookmarkedVerses[verse.verse_key] ? 
                      <BookmarkIcon fontSize="small" /> : 
                      <BookmarkBorderIcon fontSize="small" />
                    }
                  </button>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#7D5A3C]'} mt-3`}>
                  {verse.translations?.[0]?.text.replace(/<[^>]+>/g, "") || "Terjemahan tidak tersedia."}
                </p>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10 mb-6">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-[#9C7B4F]'}`}>
            Halaman {page} dari 604 | MyQuran
          </p>
        </div>
      </div>
    </div>
  );
}