import React, { useEffect, useMemo, useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import QrReader from 'react-qr-reader';

// qrscanner code adapted from this very helpful youtube video by Heart of Programming: https://www.youtube.com/watch?v=7Ntot5ClGIY


function Verify(): JSX.Element {


    // signature verification input fields
    const [inputMessageHash, setMessageHash] = useState('');
    const [inputSignature, setInputSignature] = useState('paste or use QR scanner');
    const [inputPubkey, setInputPubkey] = useState('');
    const [sigVerified, setSigVerified] = useState('N/A');

    //webcam states
    const [scanResultWebCam, setScanResultWebCam] = useState('');


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

    const handleErrorWebCam = (error: string) => {
      console.log(error);
    }

    const handleScanWebCam = (result: string) => {
      if(result) {
        setScanResultWebCam(result);
        setInputSignature(result);
      }
    }


    return (
      <div className="body">
          <div className="text">
            <h1>{`{ Verify }`}</h1>
              <h3>Manual Verify:</h3>
              The current system requires manual verification of the signature and the NFT metadata (bonding keypair public key and message hash). 
              We are working quickly to enable the data to be read directly from an NFT within a connected wallet, but it's not quite ready yet. 
              For now, 1) copy-paste the NFT metadata's "pubkey" and "message_hash" traits into the data fields below, 2) use a webcam to scan the QR code signature
              for your item, then 3) click "verify" button. Output will show "Ver verified (t/f): true if the item is valid."  <br/>
              <br/>
            <div className="row">
              <div className="column">
              <h3>Enter NFT Data:</h3>
                <table className="table">
                  <tr>
                    <td>Public Key:</td> 
                    <td>  
                      <input
                        type="text"
                        value={inputPubkey}
                        onChange={(e) => setInputPubkey(e.target.value.trim())}
                      />
                    </td>
                </tr>
                <tr>
                  <td>Message Hash: {' '}</td>
                  <td>
                    <input
                      type="text"
                      value={inputMessageHash}
                      onChange={(e) => setMessageHash(e.target.value.trim())}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Signature: {' '}</td>
                  <td>
                    <input
                      type="text"
                      value={inputSignature}
                      onChange={(e) => setInputSignature(e.target.value.trim())}
                    />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td><button onClick={resetFields}>Reset</button></td>
                </tr>
                </table>
                <br/>
                <div>
                  <table className="table">
                    <tr>
                      <td>Click button to submit:</td>
                      <td><button onClick={verifyItem}>Verify</button></td>
                    </tr>
                    <tr>
                      <td>Signature Verified:</td>
                      <td><h3>{sigVerified}</h3></td>
                    </tr>
                  </table>
                </div>
              </div>
              <div className="column">
                <div>
                  <h3>Scan QR Code to get Signature:</h3>
                  <div className="qrreader">
                    <QrReader
                      delay={300}
                      style={{width: '100%'}}
                      onError={handleErrorWebCam}
                      onScan={handleScanWebCam} 
                    />
                  </div>
                    {inputSignature ? (
                      <div>
                        signature is scanned!
                      </div>
                    ) : (
                      <div></div>
                    )
                    }
                  
                </div>
              </div>
            </div>
          </div>
        </div>

    )
}

export default Verify;