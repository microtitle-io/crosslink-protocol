import React, { FC, useEffect, useMemo, useState } from 'react';
import {Button, TextField, Typography, Container} from '@material-ui/core';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

//import Wallet from './Wallet';

import QRCode from 'qrcode';

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

    // signature display
    const [customMessage, setCustomMessage] = useState('hello world');
    const [imageUrl, setImageUrl] = useState('');
    const [outputSignature, displaySignature] = useState(''); 
    const [signedMessage, displaySignedMessage] = useState('');

    const wallet = useAnchorWallet();
    const pubkey = wallet?.publicKey;

    const message = customMessage;

    const generateQrCode = async (text: string) => {
        try {
          const response = await QRCode.toDataURL(text, { errorCorrectionLevel: 'M' });
          setImageUrl(response);
        } catch (error) {
          console.log(error);
        }
    }

    async function signMsg() {
        try {
            if (!wallet) {
              throw new Error('wallet not connected');
            }
             
            const messageUint8 = decodeUTF8(message);
            //If you want to SHA512 hash the message w/ nacl.hash() instead of plain text, use the following:
            //const messageHashUint8: Uint8Array = nacl.hash(messageUint8);
            //displayMessageHash(bs58.encode(messageHashUint8));
            displaySignedMessage(encodeUTF8(messageUint8));

            //const signed = await (wallet?.signMessage(messageHashUint8, 'hex'));
            const signed = await (wallet?.signMessage(messageUint8, 'hex'));
            displaySignature(bs58.encode(signed));
            generateQrCode(bs58.encode(signed));
        } catch (e) {
            console.warn(e);
        }
    }            

    return (  
        <div className="body">
            <div className="text">
                <h1>{`{ Sign }`}</h1>
                <div className="text">
                    This section is used to generate a signature that is permanently attached to or embedded on your item. 
                    To do this, you must first create a unique "bonding" keypair. Next, connect the keypair using your wallet, enter a message and click "sign message." <br/>
                    { pubkey ? (
                        <div>
                            {/*Bonding keypair public key: {pubkey?.toString()}*/}
                        </div>
                    ) : (
                        <br/>
                    )
                    }
                    <br/>
                    <div>
                            <TableContainer component={Paper}>
                              <Table sx={{ minWidth: 650 }}  aria-label="message table">
                                <TableBody>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                      <TableCell component="th" scope="row"><TextField id="outlined-basic" label="Message" variant="outlined" value={customMessage} onChange={(e) => setCustomMessage(e.target.value.trim())} /></TableCell>
                                      <TableCell align="right"><Button onClick={signMsg}>Sign Message</Button></TableCell>
                                    </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                        </div>
                    <table>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                    
                     <br/>
                    <br/>
                    {outputSignature ? (
                        <div>
                            <TableContainer component={Paper}>
                              <Table sx={{ minWidth: 650 }}  aria-label="signature table">
                                {/*<TableHead>
                                  <TableRow>
                                    <TableCell>Field</TableCell>
                                    <TableCell align="right">Value</TableCell>
                                  </TableRow>
                                </TableHead>*/}
                                <TableBody>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                      <TableCell component="th" scope="row">Signed message:</TableCell>
                                      <TableCell align="right">{signedMessage}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                      <TableCell>Signature:</TableCell>
                                      <TableCell align="right">{outputSignature}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>QR code (click to download):</TableCell>
                                        <TableCell align="right"><a href={imageUrl} download={pubkey}><img src={imageUrl} alt="signature QR code"  /></a></TableCell>
                                    </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Sign;
