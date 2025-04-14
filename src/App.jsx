import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurahList from './pages/SurahList';
import SurahDetail from './pages/SurahDetail';
import Home from './pages/Home';
import Bookmark from './components/Bookmark';
import SurahByJuz from './pages/SurahByJuz';
import SurahByPage from './pages/SurahByPage';
import JuzDetail from './pages/JuzDetail';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listsurah" element={<SurahList />} />
        <Route path="/surah/:id" element={<SurahDetail />} />
        <Route path="/juz" element={<SurahByJuz />} />
        <Route path="/juz/:id" element={<JuzDetail />} />
        <Route path="/page" element={<SurahByPage />} />
        <Route path="/bookmark" element={<Bookmark />} />

      </Routes>
    </Router>
  );
}

export default App;