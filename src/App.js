import logo from './logo.png';
import './App.css';
import {Routes, Route, Link} from 'react-router-dom';

import NavBar from './components/NavBar';
import Home from './components/Home';
import Sign from './components/Sign';
import Verify from './components/Verify';
import About from './components/About';

function App() {
  return (
    <div className="App">
        <NavBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/sign" element={<Sign />} />
        <Route exact path="/verify" element={<Verify />} />
        <Route exact path="/about" element={<About />} />
      </Routes>
      
    </div>
  );
}

export default App;
