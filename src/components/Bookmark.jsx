import React, { useEffect, useState } from 'react';
import { getBookmarks, removeBookmark } from '../utils/bookmark';
import { useNavigate, Link } from "react-router-dom"; 
import { ArrowLeft, Moon, Sun, Trash2 } from "lucide-react";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);
  
  const handleRemove = (surahNumber, ayahNumber) => {
    removeBookmark(surahNumber, ayahNumber);
    setBookmarks(getBookmarks()); // Update bookmark list after removal
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleVerseClick = (verseKey) => {
    const [surahNumber, verseNumber] = verseKey.split(':');
    navigate(`/surah/${surahNumber}#verse-${verseNumber}`, {
      state: { 
        scrollToVerse: verseNumber,
        highlight: true
      }
    });
  };

  const backgroundStyle = {
    backgroundImage: `url('/src/assets/bg-putih.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundColor: 'rgba(247, 244, 228, 0.2)',
    backgroundBlendMode: darkMode ? 'overlay' : 'soft-light',
  };

  return (
    <div 
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#F7F4E4] text-gray-800'}`} 
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
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-amber-400' : 'text-[#7D5A3C]'} flex items-center justify-center`}>
            <BookmarkBorderIcon className="mr-2" fontSize="large" />
            Bookmark Ayat
          </h1>
          <div className={`w-24 h-1 mx-auto my-3 ${darkMode ? 'bg-amber-400' : 'bg-[#9C7B4F]'} rounded-full`}></div>
          <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-[#9C7B4F]'} mt-2 italic`}>
            "Kumpulan ayat-ayat yang telah Anda tandai untuk dibaca kembali"
          </p>
        </div>
        
        {bookmarks.length === 0 ? (
          <div className={`max-w-md mx-auto p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 bg-opacity-90 border border-gray-700' : 'bg-white bg-opacity-90 border border-[#D6C6AF]'} text-center`}>
            <BookmarkBorderIcon fontSize="large" className={`mx-auto mb-4 ${darkMode ? 'text-amber-400' : 'text-[#9C7B4F]'}`} style={{ fontSize: '60px' }} />
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-[#6D5C38]'} italic`}>
              Belum ada bookmark tersimpan.
            </p>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-[#9C7B4F]'}`}>
              Tambahkan bookmark dengan menekan ikon  pada ayat yang ingin Anda simpan.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto">
            {bookmarks.map((item, index) => (
              <div 
                key={index} 
                className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border ${
                  darkMode 
                    ? 'bg-gray-800 bg-opacity-80 text-white border-gray-700' 
                    : 'bg-white bg-opacity-90 text-gray-800 border-[#D6C6AF]'
                } cursor-pointer`} 
                onClick={() => handleVerseClick(item.verseKey)} 
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-amber-300' : 'text-[#7D5A3C]'}`}>
                    {item.surahName} : Ayat {item.ayahNumber}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleRemove(item.surahNumber, item.ayahNumber);
                    }}
                    className={`p-2 rounded-full ${
                      darkMode 
                        ? 'bg-gray-700 text-red-400 hover:bg-red-900 hover:text-red-300' 
                        : 'bg-red-50 text-red-500 hover:bg-red-100'
                    } transition-colors`}
                    title="Hapus Bookmark"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <p className={`text-right text-2xl font-arabic mb-4 leading-loose ${darkMode ? 'text-amber-200' : 'text-[#333]'}`}
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
                
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3 opacity-50"></div>
                
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#7D5A3C]'}`}
                  dangerouslySetInnerHTML={{ __html: item.translation }}
                />
              </div>
            ))}
          </div>
        )}
        
        {bookmarks.length > 0 && (
          <div className="text-center mt-10 mb-6">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-[#9C7B4F]'}`}>
              {bookmarks.length} ayat tersimpan | MyQuran
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmark;