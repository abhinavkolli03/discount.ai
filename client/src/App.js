import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/HomeNavbar';
import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import AnalyzePage from './pages/AnalyzePage';
import AboutPage from './pages/AboutPage';
import SignInPage from './pages/SignInPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="-mt-10 bg-dark">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<GeneratePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
