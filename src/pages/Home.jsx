import React from 'react';
import { Link } from 'react-router-dom';
import bgPutih from '../assets/bg-putih.png';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import logoImage from '../assets/Logo.png';

const Home = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-5 overflow-hidden font-[Poppins]"
      style={{ backgroundImage: `url(${bgPutih})` }}
    >
      <div className="absolute inset-0 bg-[rgba(248,245,240,0.2)] z-[1]" />

      <div className="relative z-[2] text-center text-[#6d5c38] max-w-[900px] p-10">
        <header className="flex flex-col items-center p-5">
          <div>
            <img src={logoImage} className="w-[200px] h-[200px] rounded-full object-cover" alt="Logo" />
          </div>
          <h1 className="text-[35px] mt-2 mb-0">MyQuran</h1>
          <p className="text-[18px] text-[#777]">Digital Qur'an Explorer</p>
        </header>

        <div className="relative my-10 mx-auto p-8 bg-[rgba(248,245,240,0.7)] rounded-xl border border-[rgba(192,162,111,0.3)] max-w-[650px]">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[80px] text-[rgba(192,162,111,0.3)] font-serif leading-none">"</div>
          <p className="text-[24px] font-[500] text-[#8b7848] font-[Scheherazade] leading-relaxed mb-4">
          مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا
          </p>
          <p className="text-[16px] font-[500] italic text-[#6d5c38] mb-2">
          "Barangsiapa membaca satu huruf dari Kitabullah (Al-Qur'an), maka baginya satu kebaikan, dan satu kebaikan dilipatgandakan menjadi sepuluh."
          </p>
          <p className="text-[14px] text-[#8b7848] text-right m-0">— HR. At-Tirmidzi</p>
        </div>


        <div className="flex items-center justify-center my-7">
          <div className="h-[1px] w-[100px] bg-gradient-to-r from-transparent via-[#c0a26f] to-transparent" />
          <div className="mx-4 text-[24px] text-[#8b7848]">۝</div>
          <div className="h-[1px] w-[100px] bg-gradient-to-r from-transparent via-[#c0a26f] to-transparent" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 my-8">
          <Link to="/listsurah" className="flex items-center px-6 py-3 bg-[rgba(192,162,111,0.1)] border border-[rgba(192,162,111,0.3)] rounded-lg text-[#8b7848] no-underline font-[500] transition-all hover:scale-105">
            <MenuBookIcon className="mr-2 text-[18px]" />
            <span className="text-[15px]">Daftar Surah</span>
          </Link>
          <Link to="/Juz" className="flex items-center px-6 py-3 bg-[rgba(192,162,111,0.1)] border border-[rgba(192,162,111,0.3)] rounded-lg text-[#8b7848] no-underline font-[500] transition-all hover:scale-105">
            <TravelExploreIcon className="mr-2 text-[18px]" />
            <span className="text-[15px]">Juz</span>
          </Link>
          <Link to="/Page" className="flex items-center px-6 py-3 bg-[rgba(192,162,111,0.1)] border border-[rgba(192,162,111,0.3)] rounded-lg text-[#8b7848] no-underline font-[500] transition-all hover:scale-105">
            <ImportContactsIcon className="mr-2 text-[18px]" />
            <span className="text-[15px]">Halaman</span>
          </Link>
          <Link to="/bookmark" className="flex items-center px-6 py-3 bg-[rgba(192,162,111,0.1)] border border-[rgba(192,162,111,0.3)] rounded-lg text-[#8b7848] no-underline font-[500] transition-all hover:scale-105">
            <BookmarkBorderIcon className="mr-2 text-[18px]" />
            <span className="text-[15px]">Bookmark</span>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 my-10">
          <div className="flex-1 max-w-[300px] p-6 bg-[rgba(248,245,240,0.7)] rounded-xl shadow-md">
            <div className="mx-auto mb-4 w-[60px] h-[60px] flex items-center justify-center rounded-full bg-[rgba(192,162,111,0.15)]">
              <div className="text-[26px]">📚</div>
            </div>
            <h3 className="text-[18px] font-semibold mb-2 text-[#8b7848]">114 Surah Lengkap</h3>
            <p className="text-[14px] leading-relaxed text-[#6d5c38]">
              Akses seluruh surah Al-Qur'an dengan terjemahan bahasa Indonesia yang akurat
            </p>
          </div>
          <div className="flex-1 max-w-[300px] p-6 bg-[rgba(248,245,240,0.7)] rounded-xl shadow-md">
            <div className="mx-auto mb-4 w-[60px] h-[60px] flex items-center justify-center rounded-full bg-[rgba(192,162,111,0.15)]">
              <div className="text-[26px]">🎧</div>
            </div>
            <h3 className="text-[18px] font-semibold mb-2 text-[#8b7848]">Audio</h3>
            <p className="text-[14px] leading-relaxed text-[#6d5c38]">
              Dengarkan lantunan merdu dari qari terkenal
            </p>
          </div>
          <div className="flex-1 max-w-[300px] p-6 bg-[rgba(248,245,240,0.7)] rounded-xl shadow-md">
            <div className="mx-auto mb-4 w-[60px] h-[60px] flex items-center justify-center rounded-full bg-[rgba(192,162,111,0.15)]">
              <div className="text-[26px]">📱</div>
            </div>
            <h3 className="text-[18px] font-semibold mb-2 text-[#8b7848]">Responsif</h3>
            <p className="text-[14px] leading-relaxed text-[#6d5c38]">
              Akses dari berbagai perangkat dengan tampilan yang nyaman
            </p>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-[rgba(192,162,111,0.2)]">
          <span className="text-[14px] text-[#8b7848]">© 2025 MyQuran</span>
        </div>
      </div>
    </div>
  );
};

export default Home;