import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bgPutih from '../assets/bg-putih.png';
import { IoMdSearch } from "react-icons/io";

const BASE_URL = 'https://api.quran.com/api/v4';

const createMarkup = (htmlContent) => ({ __html: htmlContent });

const SurahList = () => {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/chapters`)
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data.chapters);
        setFilteredSurahs(data.chapters);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Surahs:', err);
        setLoading(false);
      });
  }, []);

  const searchSurahs = async (query) => {
    setIsSearching(true);
    try {
      if (!query.trim()) {
        setFilteredSurahs(surahs);
        setSearchResults([]);
        setShowSearchDropdown(false);
        setIsSearching(false);
        return;
      }

      const detailedResponse = await fetch(
        `${BASE_URL}/search?q=${encodeURIComponent(query)}&language=id&size=10`
      );
      const detailedData = await detailedResponse.json();
      const results = detailedData.search.results || [];

      setSearchResults(results);
      setShowSearchDropdown(true);

      const searchedSurahIds = [...new Set(results.map(result => result.verse_key.split(':')[0]))];
      const searchResultsFiltered = surahs.filter(surah =>
        searchedSurahIds.includes(surah.id.toString())
      );
      setFilteredSurahs(searchResultsFiltered);
    } catch (error) {
      console.error('Error searching surahs:', error);
      setFilteredSurahs(surahs);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchSurahs(searchTerm);
      } else {
        setFilteredSurahs(surahs);
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, surahs]);

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredSurahs(surahs);
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  const getSurahName = (surahNumber) => {
    const surah = surahs.find(s => s.id.toString() === surahNumber);
    return surah ? surah.name_simple : `Surah ${surahNumber}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading || isSearching) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[rgba(248,245,240,0.9)] text-[#6d5c38]">
        <div className="w-12 h-12 rounded-full border-4 border-t-[#c0a26d] border-[rgba(192,162,109,0.3)] animate-spin"></div>
        <p className="mt-5 text-lg font-medium font-lateef tracking-wide text-[#c0a26d]">
          {loading ? 'Memuat daftar surah...' : 'Mencari surah...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-nunito bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgPutih})` }}>
      <div className="bg-[rgba(248,245,240,0.4)] min-h-screen w-full">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-[#6d5c38] font-lateef opacity-100 tracking-wide">Daftar Surah Al-Qur'an</h2>
          </div>

          <div className="max-w-xl mx-auto mb-6 search-container relative">
            <div className="flex p-3 gap-2 rounded-xl mx-auto bg-white shadow-lg">
              <IoMdSearch size="1.7em" color="#9CA3B7" />
              <input
                type="text"
                placeholder="Cari ayat Al-Quran"
                className="outline-none text-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="bg-[rgba(192,162,109,0.1)] text-[#6d5c38] w-6 h-6 flex items-center justify-center rounded-full text-sm"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >✕</button>
              )}
            </div>
            <p className="text-center mt-2 text-sm italic text-[#8a7b5c] font-nunito tracking-wide">Cari berdasarkan nomor surah, nama surah, atau arti surah</p>

            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border">
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((result) => {
                    const [surahNumber, verseNumber] = result.verse_key.split(':');
                    return (
                      <Link
                        key={result.verse_key}
                        to={`/surah/${surahNumber}`}
                        state={{ scrollToVerse: verseNumber }}
                        className="block p-4 hover:bg-gray-50 border-b last:border-b-0"
                        onClick={() => {
                          setShowSearchDropdown(false);
                          localStorage.setItem('scrollToVerse', verseNumber);
                          localStorage.setItem('lastSearchedSurah', surahNumber);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-600">
                              {getSurahName(surahNumber)} : Ayat {verseNumber}
                            </p>
                            <p 
                              className="text-xs mt-1 text-gray-500"
                              dangerouslySetInnerHTML={createMarkup(result.translations[0]?.text || 'No translation available')}
                            />
                            <p className="text-xs mt-1 text-right text-[#b39260] font-arabic">
                              {result.text}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {filteredSurahs.length === 0 ? (
            <div className="text-center p-10 bg-white/70 rounded-lg mb-6 text-[#6d5c38] shadow-md">
              <p className="text-lg font-nunito mb-4">Tidak ada surah yang ditemukan untuk: <strong>"{searchTerm}"</strong></p>
              <button
                className="bg-gradient-to-r from-[#c0a26d] to-[#d9c9a2] text-white px-7 py-3 rounded-full font-semibold shadow-md font-nunito tracking-wide text-sm"
                onClick={clearSearch}
              >Tampilkan semua surah</button>
            </div>
          ) : (
            searchTerm && (
              <p className="text-center text-sm italic text-[#8a7b5c] mb-6 font-nunito tracking-wide">
                Menampilkan {filteredSurahs.length} surah dari total {surahs.length} surah
              </p>
            )
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSurahs.map((surah) => (
              <Link to={`/surah/${surah.id}`} key={surah.id} className="text-inherit no-underline">
                <div className="bg-white/70 rounded-2xl overflow-hidden border border-[rgba(192,162,109,0.2)] transition-shadow shadow-md relative">
                  <div className="bg-gradient-to-br from-[#c0a26d] to-[#e9dcbe] w-10 h-10 rounded-full flex items-center justify-center absolute top-5 left-5 shadow-sm">
                    <span className="text-white font-bold text-sm font-poppins">{surah.id}</span>
                  </div>
                  <div className="pl-16 pr-5 py-6 flex flex-col">
                    <div className="text-right text-3xl font-medium text-[#b39260] mb-3 font-quran leading-snug tracking-wide">{surah.name_arabic}</div>
                    <h2 className="text-xl font-semibold text-[#6d5c38] font-poppins tracking-wide">{surah.name_simple}</h2>
                    <p className="text-base text-[#6d5c38] opacity-80 mt-1 mb-3 font-lateef italic tracking-wide">{surah.translated_name.name}</p>
                    <div className="h-px bg-gradient-to-r from-transparent via-[rgba(192,162,109,0.4)] to-transparent my-3" />
                    <div className="flex justify-between text-sm text-[#b39260] font-medium font-nunito">
                      <span>📍 {surah.revelation_place === 'meccan' ? 'Makkah' : 'Madinah'}</span>
                      <span>🗒️ {surah.verses_count} Ayat</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurahList;