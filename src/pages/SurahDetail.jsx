  import { useParams, useNavigate, useLocation } from "react-router-dom";
  import { useEffect, useState, useRef } from "react";
  import ReactH5AudioPlayer from "react-h5-audio-player";
  import "react-h5-audio-player/lib/styles.css";
  import { ArrowLeft, Book, ChevronDown, ChevronUp, Play, Pause, SkipBack, SkipForward, Bookmark } from "lucide-react";
  import { saveBookmark } from '../utils/bookmark';

  export default function DetailSurah() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [verses, setVerses] = useState([]);
    const [surahAudioUrl, setSurahAudioUrl] = useState("");
    const [versesAudio, setVersesAudio] = useState([]);
    const [surahName, setSurahName] = useState("");
    const [loading, setLoading] = useState(true);
    const [tafsirSurah, setTafsirSurah] = useState(null);
    const [showTafsirSurah, setShowTafsirSurah] = useState(false);
    const [openTafsirVerses, setOpenTafsirVerses] = useState({});
    const [wordsDetail, setWordsDetail] = useState({});
    const [tajweedText, setTajweedText] = useState({});
    const [bookmarkedVerses, setBookmarkedVerses] = useState({});
    
    const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
      async function fetchData() {
        try {
          setLoading(true);
          const [versesRes, transRes, tafsirRes] = await Promise.all([
            fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`),
            fetch(`https://api.quran.com/api/v4/quran/translations/33?chapter_number=${id}`),
            fetch(`https://equran.id/api/v2/tafsir/${id}`)
          ]);
          
          const versesData = await versesRes.json();
          const transData = await transRes.json();
          const tafsirData = await tafsirRes.json();

          setTafsirSurah(tafsirData.data);

          const tafsirMap = {};
          tafsirData.data.tafsir.forEach(item => {
            tafsirMap[item.ayat] = item.teks;
          });

          const tajweedRes = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=${id}&fields=text_uthmani_tajweed,juz_number,verse_key`);
          const tajweedData = await tajweedRes.json();
          
          const tajweedMap = {};
          tajweedData.verses.forEach((verse, index) => {
            const verseNumber = index + 1;
            tajweedMap[verseNumber] = verse.text_uthmani_tajweed;
          });
          
          setTajweedText(tajweedMap);

          const combined = versesData.verses.map((verse, index) => {
            const verseNumber = index + 1; 
            return {
              ...verse,
              translation: transData.translations[index]?.text || "",
              tafsir: tafsirMap[verseNumber] || "Tafsir tidak tersedia",
              verseNumber: verseNumber,
              verseKey: `${id}:${verseNumber}`
            };
          });
          
          setVerses(combined);

          const audioRes = await fetch(`https://api.quran.com/api/v4/chapter_recitations/7/${id}`);
          const audioData = await audioRes.json();
          setSurahAudioUrl(audioData.audio_file.audio_url);

          const verseAudioRes = await fetch(`https://api.quran.com/api/v4/recitations/7/by_chapter/${id}`);
          const verseAudioData = await verseAudioRes.json();
          setVersesAudio(verseAudioData.audio_files || []);

          const metaRes = await fetch(`https://api.quran.com/api/v4/chapters/${id}?language=id`);
          const metaData = await metaRes.json();
          setSurahName(metaData.chapter.name_complex || metaData.chapter.name_arabic);

          setLoading(false);
          
          combined.forEach(verse => {
            fetchWordDetails(verse.verseKey);
          });
        } catch (err) {
          console.error("Gagal memuat data:", err);
          setLoading(false);
        }
      }

        const loadFontStyles = () => {
        const fontStylesheet = document.createElement('link');
        fontStylesheet.rel = 'stylesheet';
        fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
        document.head.appendChild(fontStylesheet);
        
        const style = document.createElement('style');
        style.textContent = `
          .arabic-text {
            font-family: 'Amiri', serif;
            font-size: 1.8rem;
            line-height: 2;
          }
        `;
        document.head.appendChild(style);
      };
      
      loadFontStyles();
      fetchData();
    }, [id]);

    useEffect(() => {
      const bookmarks = JSON.parse(localStorage.getItem('quran-bookmarks') || '[]');
      const bookmarkedMap = {};
      bookmarks.forEach(bookmark => {
        if (bookmark.surahNumber === parseInt(id)) {
          bookmarkedMap[bookmark.ayahNumber] = true;
        }
      });
      setBookmarkedVerses(bookmarkedMap);
    }, [id]);

    const fetchWordDetails = async (verseKey) => {
      if (wordsDetail[verseKey]) return; 
      try {
        const response = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?language=id&words=true&fields=text_uthmani,text_uthmani_tajweed`);
        const data = await response.json();
        
        setWordsDetail(prev => ({
          ...prev,
          [verseKey]: data.verse.words
        }));
      } catch (error) {
        console.error("Gagal memuat detail kata:", error);
      }
    };

    const toggleTafsirVerse = (verseId) => {
      setOpenTafsirVerses(prev => ({
        ...prev,
        [verseId]: !prev[verseId]
      }));
    };

    const handleBookmark = (verse) => {
      const bookmarkData = {
        surahNumber: parseInt(id),
        ayahNumber: verse.verseNumber,
        surahName: surahName, 
        text: verse.text_uthmani,
        translation: verse.translation.replace(/<[^>]+>/g, ''),
        verseKey: verse.verseKey
      };
      
      const success = saveBookmark(bookmarkData);
      if (success) {
        setBookmarkedVerses(prev => ({
          ...prev,
          [verse.verseNumber]: true
        }));
      }
    };

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const playVerseAudio = (index) => {
      if (currentAudioIndex === index) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
        return;
      }
      
      setCurrentAudioIndex(index);
      setIsPlaying(true);
      
      setCurrentTime(0);
      setDuration(0);
      
    };

    const playPreviousVerse = () => {
      if (currentAudioIndex > 0) {
        setCurrentAudioIndex(prev => prev - 1);
      }
    };

    const playNextVerse = () => {
      if (currentAudioIndex < verses.length - 1) {
        setCurrentAudioIndex(prev => prev + 1);
      }
    };

    useEffect(() => {
      if (currentAudioIndex !== null && verses.length > 0 && versesAudio.length > 0) {
        const currentVerse = verses[currentAudioIndex];
        const audioFile = versesAudio.find(audio => audio.verse_key === currentVerse.verseKey);
        
        if (audioFile && audioRef.current) {
          audioRef.current.src = `https://verses.quran.com/${audioFile.url}`;
          
          audioRef.current.load();
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
              
              const verseElement = document.getElementById(`verse-${currentVerse.verseKey}`);
              if (verseElement) {
                verseElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            }).catch(error => {
              console.error("Auto-play prevented:", error);
              setIsPlaying(false);
            });
          }
        }
      }
    }, [currentAudioIndex, verses, versesAudio]);

    useEffect(() => {
      const handleEnded = () => {
        playNextVerse();
      };

      if (audioRef.current) {
        audioRef.current.addEventListener('ended', handleEnded);
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }, [currentAudioIndex, verses]);

    useEffect(() => {
      if (location.state?.scrollToVerse) {
        const verseElement = document.getElementById(`verse-${location.state.scrollToVerse}`);
        if (verseElement) {
          setTimeout(() => {
            verseElement.scrollIntoView({ behavior: 'smooth' });
            if (location.state.highlight) {
              verseElement.classList.add('highlight-verse');
              setTimeout(() => {
                verseElement.classList.remove('highlight-verse');
              }, 3000);
            }
          }, 1000);
        }
      }
    }, [location.state, verses]);

    useEffect(() => {
      const style = document.createElement('style');
      style.textContent = `
        .highlight-verse {
          animation: highlightFade 3s ease-out;
        }
        
        @keyframes highlightFade {
          0% { background-color: rgba(255, 215, 0, 0.3); }
          100% { background-color: transparent; }
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }, []);


    return (
      <div className="min-h-screen bg-[#F7F4E4] px-4 py-8 pb-24">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#9C7B4F] hover:text-[#7E5C3C] font-medium transition"
          >
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#7D5A3C]">Surah {surahName}</h1>
          
          {surahAudioUrl && (
            <div className="mx-auto mt-4 max-w-[380px] p-4 bg-[#F0E4D7] rounded-lg shadow-xl border-[1px] border-[#7D5A3C]">
              <h3 className="text-[#7D5A3C] text-sm font-medium mb-2">Audio Surah Lengkap</h3>
              <ReactH5AudioPlayer
                src={surahAudioUrl}
                autoPlay={false}
                showJumpControls={false}
                layout="stacked"
                customAdditionalControls={[]}
                customVolumeControls={[]}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        {tafsirSurah && (
          <div className="mb-8">
            <button 
              onClick={() => setShowTafsirSurah(!showTafsirSurah)}
              className="w-full flex items-center justify-center gap-2 bg-[#DBC1A8] text-[#7D5A3C] px-4 py-3 rounded-lg font-medium hover:bg-[#C9AD94] transition"
            >
              <Book size={18} />
              <span>{showTafsirSurah ? "Sembunyikan Tafsir Surah" : "Lihat Tafsir Surah"}</span>
              {showTafsirSurah ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {showTafsirSurah && (
              <div className="mt-4 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-[#7D5A3C] mb-2">
                  {tafsirSurah.namaLatin} ({tafsirSurah.arti})
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Diturunkan di: {tafsirSurah.tempatTurun} • {tafsirSurah.jumlahAyat} ayat
                </p>
                <p className="text-[#7D5A3C] whitespace-pre-line">
                  {tafsirSurah.deskripsi.replace(/<[^>]+>/g, '\n').replace(/\n\n+/g, '\n')}
                </p>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-center text-[#9C7B4F]">Memuat ayat...</p>
        ) : (
          <div className="space-y-6">
            {verses.map((ayah, index) => (
              <div 
                key={ayah.id} 
                id={`verse-${ayah.verseKey}`}
                className={`bg-white rounded-xl shadow-md p-6 ${currentAudioIndex === index ? 'ring-2 ring-[#9C7B4F]' : ''}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#DBC1A8] text-[#7D5A3C] px-3 py-1 rounded-full font-bold">
                      {ayah.verseNumber}
                    </span>
                    <button
                      onClick={() => playVerseAudio(index)}
                      className={`p-2 rounded-full ${currentAudioIndex === index && isPlaying ? 'bg-[#9C7B4F] text-white' : 'bg-[#F0E4D7] text-[#9C7B4F]'} hover:bg-[#9C7B4F] hover:text-white transition`}
                    >
                      {currentAudioIndex === index && isPlaying ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => handleBookmark(ayah)}
                    title={bookmarkedVerses[ayah.verseNumber] ? "Hapus Bookmark" : "Bookmark Ayat Ini"}
                    className={`transition-colors ${
                      bookmarkedVerses[ayah.verseNumber]
                        ? 'text-amber-400 hover:text-amber-500'
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <Bookmark 
                      size={20}
                      className="transition-all duration-300"
                      fill={bookmarkedVerses[ayah.verseNumber] ? "currentColor" : "none"}
                      strokeWidth={bookmarkedVerses[ayah.verseNumber] ? 0 : 2}
                    />
                  </button>
                </div>
                
                <div className="text-right leading-loose mb-4">
                  {tajweedText[ayah.verseNumber] ? (
                    <p 
                      dir="rtl" 
                      lang="ar"
                      className="arabic-text"
                      dangerouslySetInnerHTML={{ __html: tajweedText[ayah.verseNumber] }}
                    />
                  ) : (
                    <p dir="rtl" lang="ar" className="arabic-text">{ayah.text_uthmani}</p>
                  )}
                </div>
                
                {wordsDetail[ayah.verseKey] && (
                  <div className="mt-1 mb-4 p-4 bg-[#F8F5EB] rounded-lg">
                    <p className="text-[#7D5A3C] text-sm flex flex-wrap gap-1">
                      {wordsDetail[ayah.verseKey].map((word, idx) => (
                        <span 
                          key={idx} 
                          className="inline-block"
                          title={word.translation?.text || ''}
                        >
                          {word.transliteration?.text || ''}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                
                <p className="text-sm text-[#7D5A3C] mb-4">Artinya: {ayah.translation.replace(/<[^>]+>/g, "")}</p>
                
                <div className="mt-2">
                  <button 
                    onClick={() => toggleTafsirVerse(ayah.id)}
                    className="flex items-center gap-2 text-[#9C7B4F] hover:text-[#7E5C3C] font-medium transition"
                  >
                    <Book size={16} />
                    <span>{openTafsirVerses[ayah.id] ? "Sembunyikan Tafsir" : "Lihat Tafsir"}</span>
                    {openTafsirVerses[ayah.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {openTafsirVerses[ayah.id] && (
                    <div className="mt-3 p-4 bg-[#F8F5EB] rounded-lg">
                      <h3 className="text-[#7D5A3C] font-medium mb-2">Tafsir Ayat {ayah.verseNumber}:</h3>
                      <p className="text-sm text-[#7D5A3C]">{ayah.tafsir}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentAudioIndex !== null && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#DBC1A8] shadow-lg p-4 z-50">
            <div className="flex flex-col space-y-2 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#7D5A3C]">
                    Ayat {verses[currentAudioIndex]?.verseNumber} dari {verses.length}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={playPreviousVerse}
                    disabled={currentAudioIndex === 0}
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${currentAudioIndex === 0 ? 'text-gray-400' : 'text-[#9C7B4F] hover:bg-[#F8F5EB]'}`}
                  >
                    <SkipBack size={18} />
                  </button>

                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        if (isPlaying) {
                          audioRef.current.pause();
                        } else {
                          audioRef.current.play();
                        }
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#9C7B4F] hover:bg-[#7E5C3C] text-white"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <button 
                    onClick={playNextVerse}
                    disabled={currentAudioIndex === verses.length - 1}
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${currentAudioIndex === verses.length - 1 ? 'text-gray-400' : 'text-[#9C7B4F] hover:bg-[#F8F5EB]'}`}
                  >
                    <SkipForward size={18} />
                  </button>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-[#9C7B4F] h-1.5 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <audio
                ref={audioRef}
                preload="metadata"
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>
    );
  }