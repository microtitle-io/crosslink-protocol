import React, { useEffect, useMemo, useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

function Verify() {

    // signature verification input fields
    const [inputMessageHash, setMessageHash] = useState('');
    const [inputSignature, setInputSignature] = useState('');
    const [inputPubkey, setInputPubkey] = useState('');
    const [sigVerified, setSigVerified] = useState('N/A');

    async function verifyItem() {
        try {
            if (!inputMessageHash) {
                throw new Error('no signature provided.');
        }
        const messageHash: string = inputMessageHash;
        const messageHashArray = new Uint8Array(bs58.decode(messageHash));
        const signatureBase58: string = inputSignature;
        const signatureArray = new Uint8Array(bs58.decode(signatureBase58));
    
        const pubkeyBase58: string = inputPubkey;  //bs58.decode(selectedWallet.publicKey!.toString());
        const pubKeyArray = new Uint8Array(bs58.decode(pubkeyBase58));
    
        // assemble all of the components, perform the detached verify of signed message.
        const verified = await nacl.sign.detached.verify(messageHashArray, signatureArray, pubKeyArray);
        setSigVerified(verified.toString());
      } catch (e) {
        console.warn(e);
      }
    }

    function resetFields() {
        setInputPubkey('');
        setMessageHash('');
        setInputSignature('');
        setSigVerified('N/A');
        
    }

    return (
        <div className="body">
            <div className="text">
                <h1>{`{ Verify }`}</h1>
                <div>
                    <div>
                        The current system requires manual verification of the signature and the NFT metadata (bonding keypair public key and message hash). 
                        We are working quickly to enable the data to be read directly from an NFT within a connected wallet, but it's not quite ready yet. <br/>
                    </div>
                    <div>
                      Base 58 public key: 
                      <input
                        type="text"
                        value={inputPubkey}
                        onChange={(e) => setInputPubkey(e.target.value.trim())}
                      />
                    </div>
                    <div>
                      Message hash: {' '}
                      <input
                        type="text"
                        value={inputMessageHash}
                        onChange={(e) => setMessageHash(e.target.value.trim())}
                      />
                    </div>
                    <div>
                        Signature Raw Text (base58): {' '}
                        <input
                            type="text"
                            value={inputSignature}
                            onChange={(e) => setInputSignature(e.target.value.trim())}
                        />
                        <button onClick={verifyItem}>Verify</button><br />
                        signature verified (t/f): {sigVerified} <br/>
                        <button onClick={resetFields}>Reset</button><br />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Verify;