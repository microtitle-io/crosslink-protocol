// Attribution: qrscanner code adapted from this very helpful youtube video by Heart of Programming: https://www.youtube.com/watch?v=7Ntot5ClGIY

import React, { useEffect, useMemo, useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import QrReader from 'react-qr-reader';
import { decodeUTF8 } from 'tweetnacl-util';

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  clusterApiUrl,
  Message,
  AccountInfo,
  Cluster
} from '@solana/web3.js';

// imports required for getMetadataByMint()
import axios from 'axios'; 
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';


const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

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

export default function Verify() {

  // use anchor wallet
  const wallet = useAnchorWallet();
  const pubkey = wallet?.publicKey;
  const connectedWalletAddress = wallet?.publicKey.toString() || '';

    // signature verification input fields
    const [inputMessage, setMessage] = useState('');
    const [inputSignature, setInputSignature] = useState('');
    const [inputPubkey, setInputPubkey] = useState('');
    const [accountMints, setAccountMints] = useState(['']);
    const [sigVerified, setSigVerified] = useState(false);
    const [selectedMint, setselectedMint] = useState<String>();
    const [selectedNetwork, setSelectedNetwork] = useState('');
    //webcam states
    const [scanResultWebCam, setScanResultWebCam] = useState('');
    //NFT metadata retrieval
    const [mintMetadata, setMintMetadata] = useState(''); 
    const [curName, setName] = useState(''); 
    const [curImage, setImage] = useState(''); 
    const [curAttribute, setAttributes] = useState(''); 
    const [traitMessage, setTraitMessage] = useState('');
    const [traitPubkey, setTraitPubkey] = useState('');
    const [allTraits, setAllTraits] = useState(['']);

    // Select the network to draw on-chain data from:
    const selectNetwork = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      if (value === "devnet") {
        const url = clusterApiUrl("devnet");
        setSelectedNetwork(url);
      }
      else if (value === "mainnet-beta") {
        const url = clusterApiUrl("mainnet-beta");
        setSelectedNetwork(url);
      }
      else if (value === "testnet") {
        const url = clusterApiUrl("testnet");
        setSelectedNetwork(url);
      }
    };

    const getMints = async () => {

        const connection = new Connection(selectedNetwork, "confirmed");
    
        const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {
          filters: [
            {
              dataSize: 165, // number of bytes
            },
            {
              memcmp: {
                offset: 32, // number of bytes
                bytes: connectedWalletAddress, // base58 encoded string
              },
            },
          ],
        }
      );

      const mints: string[] = [];

      accounts.forEach((account, i) => {
        //const mint_id = account.pubkey.toString(); // THIS IS JUST THE TOKEN ACCOUNT ADDRESS, NOT MINT ID!
        // you had to set compiler option
        const mint_id = account.account.data["parsed"]["info"]["mint"];

        // implicit filter out of non-unique / fungible or normal SPL token accounts. QTY must = 1 
        const quantity = `${account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"]}`;
        if (Number(quantity) == 1) {
          mints.push(mint_id);
        } else {

        }
      });
      setAccountMints(mints);
      //setMintQuantities(quantities);
    }

    // Drop-down menu handling for selected Mint ID
    // example source from here: https://www.kindacode.com/article/react-typescript-handling-select-onchange-event/ 
    const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setselectedMint(value);
    };


    // modified function taken from NFT-Armory: https://github.com/ilmoi/nft-armory
    // shout out to ilmoi!
    async function getMetadataByMint(
      mint: PublicKey //,
      //metadataPDA?: PublicKey,
      //metadataOnchain?: MetadataData
    ) {

      const connection = new Connection(selectedNetwork, "confirmed");

      const pda = (await Metadata.getPDA(mint));
      const onchain = (await Metadata.load(connection, pda)).data;
      const metadataExternal = (await axios.get(onchain.data.uri)).data;
      return {
        metadataPDA: pda,
        metadataOnchain: onchain,
        metadataExternal,
      };
    }

    const handleMetadata= async () => {
      //const mint = selectedMint || '';
      const mintId = new PublicKey(selectedMint || '') 
      const metadata = getMetadataByMint(mintId);
      
      const metadataTemp: any[] = [];
      const pda = (await metadata).metadataPDA;
      const onChain = (await metadata).metadataOnchain;
      const external = (await metadata).metadataExternal;
      
      const name = onChain.data.name;
      const uri = onChain.data.uri;


      //const attributes = JSON.parse(external.attributes);
      setName(name);
      setImage(external.image);
      setMintMetadata(uri);

      //const attributesJson = JSON.parse(external.attributes);
      const attributes = external.attributes; // BUG: need to handle where attributes is undefined

      const everyTrait: any[] = [];
      const everyValue: any[] = [];
      attributes.forEach((trait, i) => {
        const traitJson = JSON.parse(JSON.stringify(trait));
          if (traitJson.trait_type.toLowerCase() === "message") {
            setTraitMessage(traitJson.value.toLowerCase());
          } else if (traitJson.trait_type.toLowerCase() === "pubkey") {
            setTraitPubkey(traitJson.value);
          }
          else {
            // need to handle 
          }
          everyTrait.push([traitJson.trait_type, traitJson.value]);
      });
      setAllTraits(everyTrait);
    }

    async function verifyItem() {
        //try {
        //    if (!traitMessage) {
        //        throw new Error('no signature provided.');
        //}
        const message: string = traitMessage;
        //const messageArray = new Uint8Array(bs58.decode(message));
        const messageArray = new Uint8Array(decodeUTF8(message));
        const signatureBase58: string = inputSignature;
        const signatureArray = new Uint8Array(bs58.decode(signatureBase58));
    
        const pubkeyBase58: string = traitPubkey;  //bs58.decode(selectedWallet.publicKey!.toString());
        const pubKeyArray = new Uint8Array(bs58.decode(pubkeyBase58));
    
        // assemble all of the components, perform the detached verify of signed message.
        const verified = await nacl.sign.detached.verify(messageArray, signatureArray, pubKeyArray);
        setSigVerified(verified);
      //} catch (e) {
      //  console.warn(e);
      //}
    }

    function resetFields() {
        setInputPubkey('');
        setMessage('');
        setInputSignature('');
        setSigVerified(false);
        setAccountMints([]);
        setselectedMint('');
        //setSelectedNetwork('');
        setTraitMessage('');
        setTraitPubkey('');
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
              <h3>Microtitle Verification Sequence:</h3>
              The app compares the QR code signature of your physical item with corresponding signing data contained within the NFT's metadata--the bonding keypair public key and associated message. 
              Steps: 1) Connect your wallet containing the NFT "microtitle" you want to verify. 2) Select the appropriate network, 3) click "get mints" button, 4) select the Mint ID of relevant NFT, 5) confirm the NFT displayed matches your selection, 6) use a webcam to scan the QR code signature
              for your item, and finally 7) click "verify" button. Output will show "Signature verified: true" if the item is valid.  <br/>
              <br/>
            <div className="row">
              <div className="column">
              <h3>Mint Data:</h3>
              { pubkey ? (
                        <div>
                            Connected wallet: {pubkey?.toString()}
                            <div>
                            <select id="selectNetworkId" onChange={selectNetwork}>
                              <option selected disabled>SELECT NETWORK</option>
                              <option value={"devnet"}>devnet</option>
                              <option value={"mainnet-beta"}>mainnet-beta</option>
                              <option value={"testnet"}>testnet</option><br/>
                            </select>
                            { selectedNetwork ? (
                                <div>selected network: {selectedNetwork}</div>
                              ) : (
                                <div><br/></div>
                              )}
                            <div>
                              <button onClick={getMints}>get connected mint IDs</button><br/>
                            </div>
                              connected mints:<br/>
                              <select id="selectMintId" onChange={selectChange}>
                              <option selected disabled>SELECT MINT ID TO VERIFY</option>
                                { accountMints.map(item => <option value={item}> {item} </option>)}
                              </select><br/>
                            </div>
                              <div>selected mint id: {selectedMint}</div>
                              <div><button onClick={handleMetadata}>get metadata!</button></div>
                              <div><br/></div>
                              <div><button onClick={resetFields}><b>Reset all Fields</b></button></div>
                        </div>
                    ) : (
                        <div><h3>Please Connect Wallet</h3></div>
                    )
              }
              </div>

              <div className="column">
                <h3>NFT Metadata:</h3>
                <div>
                  { curName ? (
                    <div>
                        <div><b>{ curName } </b><br/></div>
                        <div><a href={curImage} target="_blank"><img src={curImage} className='nft'/></a></div>
                        <div><a href={mintMetadata} target="_blank">metadata</a></div>
                        <table className='meta'>
                          <tr><td>Attributes:</td></tr>
                            { allTraits.map(item => <tr><td>{item[0]}: </td><td>{item[1]}</td></tr>)}
                        </table>
                    </div>
                  ) : (
                    <><div>First, use pane to the left to retrieve NFT metadata, OR use manual trait entry below:</div>
                    <br/>
                    <div>
                        <table className="table">
                          <tr>
                            <td>Public Key:</td>
                            <td>
                              <input
                                type="text"
                                value={traitPubkey}
                                onChange={(e) => setTraitPubkey(e.target.value.trim())} />
                            </td>
                          </tr>
                          <tr>
                            <td>Message: {' '}</td>
                            <td>
                              <input
                                type="text"
                                value={traitMessage}
                                onChange={(e) => setTraitMessage(e.target.value.trim())} />
                            </td>
                          </tr>
                          <tr>
                            <td>Signature: {' '}</td>
                            <td>
                              <input
                                type="text"
                                value={inputSignature}
                                onChange={(e) => setInputSignature(e.target.value.trim())} />
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td><button onClick={resetFields}>Reset</button></td>
                          </tr>
                        </table>
                        <br />
                    </div></>
                  )
                  }
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
                      <table className='meta'>
                        <tr>scanned signature: </tr>
                        <tr>{inputSignature}</tr>
                      </table>
                    ) : (
                      <div></div>
                    )
                    }
                    <br/>
                  <div>
                  <table className="table">
                    <tr>
                      <td>Click button to submit:</td>
                      <td><button onClick={verifyItem}>Verify</button></td>
                    </tr>
                    <tr>
                      <td>Signature Verified:</td>
                      <td>
                          { sigVerified ? (
                            <h3 style={{color: "white"}}> {sigVerified.toString()} </h3>
                            ) : (
                            <h3 style={{color: "red"}}> {sigVerified.toString()} </h3>
                            )
                          }
                      </td>
                    </tr>
                  </table>
                </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

    )
}

//export default Verify;