import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../logo.png";

function NavBar() {
    return (
        <div className="footer">
        <ul>
            <li>
                &#169; Copyright 2021
            </li>
            <li>
                crosslink.pro
            </li>
            <li>proudly open source</li>
            <li>
                v1.0.2
            </li>
        </ul>
        </div>
    );
}

export default NavBar;