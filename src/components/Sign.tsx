import React, { FC, useEffect, useMemo, useState } from 'react';

import bs58 from 'bs58';
import nacl from 'tweetnacl';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} from 'tweetnacl-util';

//import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    clusterApiUrl,
    Message
  } from '@solana/web3.js';

import Wallet from './Wallet';

export interface AnchorWallet {
    publicKey: PublicKey;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signMessage(message: Uint8Array, display: unknown): Promise<Uint8Array>;
}

export function useAnchorWallet(): AnchorWallet | undefined {
    const { publicKey, signTransaction, signAllTransactions, signMessage } = useWallet();
    return useMemo(
        () =>
            publicKey && signTransaction && signAllTransactions && signMessage
                ? { publicKey, signTransaction, signAllTransactions, signMessage }
                : undefined,
        [publicKey, signTransaction, signAllTransactions, signMessage]
    );
}

function toHex(buffer: Buffer) {
    return Array.prototype.map
      .call(buffer, (x: number) => ('00' + x.toString(16)).slice(-2))
      .join('');
  }

function Sign() {

    const [logs, setLogs] = useState<string[]>([]);
    function addLog(log: string) {
        setLogs((logs) => [...logs, log]);
    }

    // signing
    const [signatureArray, setSignatureArray] = useState<Uint8Array>();

    // signature display
    const [customMessage, setCustomMessage] = useState('hello world');
    const [imageUrl, setImageUrl] = useState('');
    const [outputSignature, displaySignature] = useState(''); 
    const [outputMessageHash, displayMessageHash] = useState('');

    const wallet = useAnchorWallet();
    const pubkey = wallet?.publicKey;

        const message = customMessage;



async function signMsg() {
    try {
        if (!wallet) {
          throw new Error('wallet not connected');
        }

        // get the message and SHA512 hash it w/ nacl.hash() 
        const messageUint8 = decodeUTF8(message);
        const messageHashUint8: Uint8Array = nacl.hash(messageUint8);
        displayMessageHash(bs58.encode(messageHashUint8));

        const signed = await (wallet?.signMessage(messageHashUint8, 'hex'));
        displaySignature(bs58.encode(signed));
        //setSignatureArray(signed);
    } catch (e) {
        console.warn(e);
        //addLog(`Error: ${(e as Error).message}`);
    }
}            

    return (  
        <>
            <div>
                <h1>{`{ Generate Signature }`}</h1>
            </div>
            <div className="sign">
                <div className="text">
                    Create and connect a *unique* and *unused* keypair to generate signature of the bonded item. 1 keypair = 1 item. Again, do not reuse addresses! <br/>
                    { pubkey ? (
                        <div>
                            Bonding keypair public key: {pubkey?.toString()}
                        </div>
                    ) : (
                        <br/>
                    )
                    }
                    <br/>
                    Message to sign:{' '}
                    <input
                        type="text"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value.trim())}
                    />
                    <button onClick={signMsg}>Sign Message</button> <br/>
                    {outputSignature ? (
                        <div>
                            messageHash: {outputMessageHash} <br/>
                            signature: {outputSignature} <br/>
                        </div>
                    ) : (
                        <div>
                            sign a message!
                        </div>
                    )}
                    <div className="logs">
                        {logs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Sign;
