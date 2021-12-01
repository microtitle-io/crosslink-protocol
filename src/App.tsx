import logo from './logo.png';
import './App.css';
import {Routes, Route, Link} from 'react-router-dom';

import NavBar from './components/NavBar';
import Home from './components/Home';
import Sign from './components/Sign';
import Mint from './components/Mint';
import Verify from './components/Verify';
import About from './components/About';
import Footer from './components/Footer';



import React, { useEffect, useMemo, useState } from 'react';

function App() {
  return (
    <div className="App">
        <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
