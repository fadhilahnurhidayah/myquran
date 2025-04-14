import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bgPutih from '../assets/bg-putih.png';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function SurahByJuz() {
  const [juzs, setJuzs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJuzs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.quran.com/api/v4/juzs');
        if (!response.ok) throw new Error(`Failed to fetch juzs: ${response.status}`);
        
        const data = await response.json();
        console.log('API Response:', data); // For debugging
        
        // Filter juzs to only include 1-30
        const validJuzs = data.juzs.filter(juz => juz.id >= 1 && juz.id <= 30);
        
        // Sort juzs by id to ensure they're in order
        validJuzs.sort((a, b) => a.id - b.id);
        
        setJuzs(validJuzs);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJuzs();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-5 overflow-hidden font-['Poppins',sans-serif]"
           style={{ backgroundImage: `url(${bgPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-[rgba(248,245,240,0.2)] z-10"></div>
        <div className="relative z-20 text-center text-[#6d5c38] p-10 max-w-[650px] bg-[rgba(248,245,240,0.7)] rounded-xl border border-[rgba(192,162,111,0.3)]">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#c0a26f] to-transparent"></div>
            <div className="mx-4 text-2xl text-[#8b7848]">۝</div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#c0a26f] to-transparent"></div>
          </div>
          <h2 className="text-2xl font-medium text-[#8b7848] mb-6">Loading Juzs...</h2>
          <div className="w-12 h-12 border-4 border-[#c0a26f] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-5 overflow-hidden font-['Poppins',sans-serif]"
           style={{ backgroundImage: `url(${bgPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-[rgba(248,245,240,0.2)] z-10"></div>
        <div className="relative z-20 text-center text-[#6d5c38] p-10 max-w-[650px] bg-[rgba(248,245,240,0.7)] rounded-xl border border-[rgba(192,162,111,0.3)]">
          <h2 className="text-2xl font-medium text-[#8b7848] mb-4">Error Loading</h2>
          <p className="mb-6 text-[#6d5c38]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[rgba(192,162,111,0.2)] border border-[rgba(192,162,111,0.3)] rounded-lg text-[#8b7848] font-medium transition-all duration-300 hover:bg-[rgba(192,162,111,0.3)]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col p-5 overflow-hidden font-['Poppins',sans-serif]"
         style={{ backgroundImage: `url(${bgPutih})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-[rgba(248,245,240,0.2)] z-10"></div>
      <div className="relative z-20 text-center text-[#6d5c38] w-full max-w-[900px] mx-auto p-5">
        
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center px-4 py-2 bg-[rgba(192,162,111,0.1)] border border-[rgba(192,162,111,0.3)] rounded-lg text-[#8b7848] no-underline font-medium transition-all duration-300 hover:bg-[rgba(192,162,111,0.2)]">
            <ArrowBackIcon className="mr-1 text-lg" />
            <span>Kembali</span>
          </Link>
        </div>
        
        <div className="flex items-center justify-center my-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#c0a26f] to-transparent"></div>
          <div className="mx-4 text-2xl text-[#8b7848]">۝</div>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#c0a26f] to-transparent"></div>
        </div>
        
        <h2 className="text-3xl font-medium text-[#8b7848] mb-8">Browse Quran by Juz</h2>
        
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link to="/listsurah" className="flex items-center px-6 py-3 bg-[rgba(192,162,111,0.1)] border border-[rgba(192,162,111,0.3)] rounded-lg text-[#8b7848] no-underline font-medium transition-all duration-300 hover:bg-[rgba(192,162,111,0.2)]">
            <MenuBookIcon className="mr-2 text-lg" />
            <span className="text-base">Daftar Surah</span>
          </Link>
          <Link to="/Juz" className="flex items-center px-6 py-3 bg-[rgba(192,162,111,0.2)] border border-[rgba(192,162,111,0.4)] rounded-lg text-[#8b7848] no-underline font-medium">
            <TravelExploreIcon className="mr-2 text-lg" />
            <span className="text-base">Juz</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {juzs.map((juz) => (
            <Link
              key={juz.id}
              to={`/juz/${juz.id}`}
              className="block bg-[rgba(248,245,240,0.7)] rounded-xl border border-[rgba(192,162,111,0.3)] p-4 no-underline transition-all duration-300 hover:shadow-lg hover:bg-[rgba(248,245,240,0.9)]"
            >
              <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center rounded-full bg-[rgba(192,162,111,0.15)] text-[#8b7848] font-bold">
                {juz.id}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#8b7848]">Juz {juz.id}</h3>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 pt-5 border-t border-[rgba(192,162,111,0.2)]">
          <span className="text-sm text-[#8b7848]">© 2025 MyQuran</span>
        </div>
      </div>
    </div>
  );
}

export default SurahByJuz;