import React from 'react';
import qrcode from '../qrcode.png';

function Home() {
    return (
        <div>
            <h1>{`{ Crosslink Protocol }`}</h1>
            <div className="text">
                NFT titles for durable goods, secured by the Solana blockchain.
            </div>
            <div className="how">
                <h2>How does it work?</h2>
                <img src={qrcode} className="qrcode" alt="Example QR code signature." />
                <ul className="process">
                    <li>1. Create a "linking" keypair</li>
                    <li>2. Generate signature (2D QR code)</li>
                    <li>3. Permanently attach signature to item</li>
                    <li>4. Mint the NFT "microtitle"</li>
                    <li>5. Verify signature against the microtitle at any time!</li>
                </ul>
                <br/>
            </div>
        </div>
    )
}

export default Home;