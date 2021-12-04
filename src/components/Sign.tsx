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
import { SingleBedTwoTone } from '@material-ui/icons';




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
//    const pubkey = new PublicKey('');

//    const address = pubkey.toBase58;

    const wallet = useAnchorWallet();
    const pubkey = wallet?.publicKey;

//        const pubkey = wallet?.publicKey;
        const message = customMessage;
//        const message = "hello world";
        const messageUint8 = decodeUTF8(message);
        const messageHashUint8: Uint8Array = nacl.hash(messageUint8);
        const messageHashBase58 = bs58.encode(messageHashUint8);

async function signMsg() {
    try {
        if (!wallet) {
          throw new Error('wallet not connected');
        }
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
            <div className="how">
                <h2>{pubkey?.toString()}</h2>
                <div className="text">
                    Message to sign:{' '}
                    <input
                        type="text"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value.trim())}
                    />
                    <button onClick={signMsg}>Sign Message</button> <br/>
                    messageHash: {messageHashBase58} <br/>
                    signature: {outputSignature} <br/>
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
