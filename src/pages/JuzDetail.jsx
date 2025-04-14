import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function JuzDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [juzData, setJuzData] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJuzDetail = async () => {
      try {
        setLoading(true);
        const juzNumber = parseInt(id);
        if (isNaN(juzNumber) || juzNumber < 1 || juzNumber > 30) {
          setError("Nomor Juz tidak valid. Harus antara 1 hingga 30.");
          setLoading(false);
          return;
        }

        const juzResponse = await fetch(`https://api.quran.com/api/v4/juzs/${id}`);
        if (!juzResponse.ok) throw new Error(`Gagal mengambil data Juz: ${juzResponse.status}`);
        const juzData = await juzResponse.json();

        const versesResponse = await fetch(
          `https://api.quran.com/api/v4/quran/verses/uthmani?juz_number=${id}`
        );
        if (!versesResponse.ok) throw new Error(`Gagal mengambil ayat: ${versesResponse.status}`);
        const versesData = await versesResponse.json();

        setJuzData(juzData.juz);
        setVerses(versesData.verses);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJuzDetail();
  }, [id, navigate]);

  const goToPreviousJuz = () => {
    const prevJuz = parseInt(id) - 1;
    if (prevJuz >= 1) navigate(`/juz/${prevJuz}`);
  };

  const goToNextJuz = () => {
    const nextJuz = parseInt(id) + 1;
    if (nextJuz <= 30) navigate(`/juz/${nextJuz}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8f3e8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-[#6d5c38] font-medium">Memuat Juz {id}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f3e8]">
        <div className="bg-[#fff2f2] p-6 rounded-lg shadow-md text-center">
          <p className="text-[#cc0000] font-medium">{error}</p>
          <Link to="/juz" className="mt-4 inline-block px-4 py-2 bg-[#FFD700] text-[#6d5c38] font-semibold rounded hover:bg-[#ffdf55]">
            Kembali ke Daftar Juz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3e8] text-[#6d5c38] font-[Poppins]">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#FFD700]">Juz {juzData.id}</h1>
          <p className="mt-2 text-[#7d6b4c]">Berisi ayat dari:</p>
          <div className="text-sm mt-1 text-[#a68d62]">
            {Object.entries(juzData.verse_mapping).map(([surahId, verses], index, array) => (
              <span key={surahId}>
                Surah {surahId} (ayat {verses})
                {index < array.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>

          {/* Navigasi Juz */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={goToPreviousJuz}
              disabled={parseInt(id) <= 1}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                parseInt(id) <= 1
                  ? 'bg-gray-300 cursor-not-allowed text-white'
                  : 'bg-[#FFD700] text-[#6d5c38] hover:bg-[#ffdf55]'
              }`}
            >
              Juz Sebelumnya
            </button>
            <button
              onClick={goToNextJuz}
              disabled={parseInt(id) >= 30}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                parseInt(id) >= 30
                  ? 'bg-gray-300 cursor-not-allowed text-white'
                  : 'bg-[#FFD700] text-[#6d5c38] hover:bg-[#ffdf55]'
              }`}
            >
              Juz Selanjutnya
            </button>
          </div>
        </div>

        {/* Ayat disatukan */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-[#e6dcc5]">
          <h2 className="text-2xl font-semibold mb-4 text-[#FFD700]">Ayat-ayat dalam Juz {juzData.id}</h2>
          <div className="text-right text-2xl leading-loose font-amiri text-[#6d5c38]" dir="rtl">
            {verses.map((verse) => (
              <span key={verse.id}>
                {verse.text_uthmani} ﴿{verse.verse_key}﴾{' '}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JuzDetail;