import logo from './logo.png';
import './App.css';
import {Routes, Route, Link} from 'react-router-dom';

import NavBar from './components/NavBar';
import Home from './components/Home';
import Sign from './components/Sign';
import Mint from './components/Mint';
import Register from './components/Register';
import Verify from './components/Verify';
import About from './components/About';
import Footer from './components/Footer';
import Wallet from './components/Wallet';

import React, { useContext, FC } from 'react';

//const walletContext = React.createContext();

const App: FC = () => {
  return (
    <div className="App">
      <Wallet>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
      </Wallet>
    </div>
  );
}

export default App;
