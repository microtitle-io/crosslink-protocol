// Attribution: qrscanner code adapted from this very helpful youtube video by Heart of Programming: https://www.youtube.com/watch?v=7Ntot5ClGIY

import React, { useEffect, useMemo, useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import QrReader from 'react-qr-reader';
import { decodeUTF8 } from 'tweetnacl-util';

function Verify(): JSX.Element {

    // signature verification input fields
    const [inputMessage, setMessage] = useState('');
    const [inputSignature, setInputSignature] = useState('');
    const [inputPubkey, setInputPubkey] = useState('');
    const [sigVerified, setSigVerified] = useState('N/A');

    //webcam states
    const [scanResultWebCam, setScanResultWebCam] = useState('');


    async function verifyItem() {
        try {
            if (!inputMessage) {
                throw new Error('no signature provided.');
        }
        const message: string = inputMessage;
        //const messageArray = new Uint8Array(bs58.decode(message));
        const messageArray = new Uint8Array(decodeUTF8(message));
        const signatureBase58: string = inputSignature;
        const signatureArray = new Uint8Array(bs58.decode(signatureBase58));
    
        const pubkeyBase58: string = inputPubkey;  //bs58.decode(selectedWallet.publicKey!.toString());
        const pubKeyArray = new Uint8Array(bs58.decode(pubkeyBase58));
    
        // assemble all of the components, perform the detached verify of signed message.
        const verified = await nacl.sign.detached.verify(messageArray, signatureArray, pubKeyArray);
        setSigVerified(verified.toString());
      } catch (e) {
        console.warn(e);
      }
    }

    function resetFields() {
        setInputPubkey('');
        setMessage('');
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
              The current system requires manual verification of the signature and the NFT metadata (bonding keypair public key and message). 
              We are working quickly to enable the data to be read directly from an NFT within a connected wallet, but it's not quite ready yet. 
              For now, 1) copy-paste the NFT metadata's "pubkey" and "message" traits into the data fields below, 2) use a webcam to scan the QR code signature
              for your item, then 3) click "verify" button. Output will show "Signature verified: true" if the item is valid.  <br/>
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
                  <td>Message: {' '}</td>
                  <td>
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setMessage(e.target.value.trim())}
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