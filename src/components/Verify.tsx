import React, { useEffect, useMemo, useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

function Verify() {

    // signature verification input fields
    const [inputMessageHash, setMessageHash] = useState('message hash');
    const [inputSignature, setInputSignature] = useState('base58 signature input');
    const [inputPubkey, setInputPubkey] = useState('base58 pubkey input');
    const [sigVerified, setSigVerified] = useState('false');
    const [displayActive, setDisplayActive] = useState('false');

    async function verifyItem() {
        try {
            if (!inputMessageHash) {
                throw new Error('no signature provided.');
        }
        setDisplayActive('false');
        const messageHash: string = inputMessageHash;
        const messageHashArray = new Uint8Array(bs58.decode(messageHash));
        const signatureBase58: string = inputSignature;
        const signatureArray = new Uint8Array(bs58.decode(signatureBase58));
    
        const pubkeyBase58: string = inputPubkey;  //bs58.decode(selectedWallet.publicKey!.toString());
        const pubKeyArray = new Uint8Array(bs58.decode(pubkeyBase58));
    
        // assemble all of the components, perform the detached verify of signed message.
        const verified = nacl.sign.detached.verify(messageHashArray, signatureArray, pubKeyArray);
        setSigVerified(verified.toString());
        setDisplayActive('true');
      } catch (e) {
        console.warn(e);
      }
    }
    return (
        <div className="sign">
            <h1>{`{ Verify }`}</h1>
            <div>
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
                  { (displayActive && true) ? (
                      <div>
                          signature verified (t/f): {sigVerified}
                      </div>
                  ) : (
                      <div>
                          ham sandwich
                      </div>
                  )}
                </div>
            </div>
        </div>
    )
}

export default Verify;