import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../logo.png";
//import Wallet from './Wallet';
import {Button} from '@mui/material';

function NavBar() {
    return (
        <div className="nav">
        <ul>
            <li>
                <img src={logo} className="App-logo" alt="logo" />
            </li>
            <li>
                <Button variant="outlined"><Link to="/">Home</Link></Button>
            </li>
            <li>
                <Button variant="outlined"><Link to="/sign">Sign</Link></Button>
            </li>
            <li>
                <Button variant="outlined"><Link to="mint">Mint</Link></Button>
            </li>
            <li>
                <Button variant="outlined"><Link to="/register">Register</Link></Button>
            </li>
            <li>
                <Button variant="outlined"><Link to="/verify">Verify</Link></Button>
            </li>

            <li>
                <Button variant="outlined"><Link to="/about">About</Link></Button>
            </li>
           {/* <li>
                wallet<Wallet />
            </li>*/}
        </ul>
        </div>
    );
}

export default NavBar;