import logo from './cube-purple.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Crosslink Protocol
        </p>
        <div className="Text">
          <p>
            Crosslink Protocol is a permissionless protocol for bringing physical goods on-chain, for proof of ownership and authenticity. 
            We are currently in development, with alpha release planned December 2021. In the meantime, please read our &nbsp;
            <a
              className="App-link"
              href="https://github.com/microtitle-io/crosslink-protocol/blob/main/docs/crosslink-protocol-v0.1b.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              whitepaper
            </a>
            .
          </p>
          <p>
            Copyright 2021 - microtitle.io
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
