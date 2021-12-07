import React from 'react';
import qrcode from '../qrcode.png';

function Home() {
    return (
        <div className="body">
            <div className="text">
                <h1>{`{ Crosslink Protocol }`}</h1>
                NFT titles for durable goods, secured by the Solana blockchain.
                <div className="text">
                    <h2>How does it work?</h2>
                    <img src={qrcode} className="qrcode" alt="Example QR code signature." />
                    <ol>
                        <li>Create a "bonding" keypair</li>
                        <li>Generate signature (2D QR code)</li>
                        <li>Permanently attach signature to item</li>
                        <li>Mint the NFT "microtitle"</li>
                        <li>Verify signature against the microtitle at any time!</li>
                    </ol>
                    <br/>
                </div>
            </div>
        </div>
    )
}

export default Home;