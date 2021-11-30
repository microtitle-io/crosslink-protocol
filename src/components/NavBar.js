import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../logo.png";

function NavBar() {
    return (
        <div className="nav">
        <ul>
            <li>
                <img src={logo} className="App-logo" class="center" alt="logo" />
            </li>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/sign">Sign</Link>
            </li>
            <li>
                <Link to="/verify">Verify</Link>
            </li>
            <li>
                <Link to="/about">About</Link>
            </li>
        </ul>
        </div>
    );
}

export default NavBar;