// Attribution: qrscanner code adapted from this very helpful youtube video by Heart of Programming: https://www.youtube.com/watch?v=7Ntot5ClGIY

import React, { useState } from 'react';

// utils
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import QrReader from 'react-qr-reader';
import { Int64LE } from 'int64-buffer';

// UI components
import {Button, TextField, Typography, Container} from '@material-ui/core';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// wallet stuff
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
} from '@solana/web3.js';

// imports required for getMetadataByMint()
import axios from 'axios'; 
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

// on-chain program details 
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
export const MICROTITLE_PROGRAM_ID = new PublicKey('KdWVDYMteVwTbBNZGfCkS2ayCFEWhbkBoFZxPwdqCgu');

export default function Verify() {

  // use anchor wallet
  const wallet = useAnchorWallet();
  const pubkey = wallet?.publicKey;
  const connectedWalletAddress = wallet?.publicKey.toString() || '';

  // signature verification input fields
  const [inputSignature, setInputSignature] = useState('');
  const [accountMints, setAccountMints] = useState(['']);
  const [sigVerified, setSigVerified] = useState(false);
  const [regVerified, setRegVerified] = useState(false);
  const [selectedMint, setselectedMint] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  // registration verification fields
  const [regCheckOutput, setRegCheckOutput] = useState('');
  //NFT metadata retrieval
  const [mintMetadata, setMintMetadata] = useState(''); 
  const [curName, setName] = useState(''); 
  const [curImage, setImage] = useState(''); 
  const [NFTUrl, setNFTUrl] = useState(''); 
  const [traitMessage, setTraitMessage] = useState('');
  const [traitPubkey, setTraitPubkey] = useState('');
  const [allTraits, setAllTraits] = useState(['']);
  const [selectedNetworkShortName, setSelectedNetworkShortName] = useState('devnet');

  // Select the network to draw on-chain data from:
  const selectNetwork = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value;
    if (value === "devnet") {
      setSelectedNetworkShortName(value);
      const url = clusterApiUrl("devnet");
      setSelectedNetwork(url);
    }
    else if (value === "mainnet-beta") {
      setSelectedNetworkShortName(value);
      const url = clusterApiUrl("mainnet-beta");
      setSelectedNetwork(url);
    }
    // else if (value === "testnet") {
      // const url = clusterApiUrl("testnet");
      // setSelectedNetwork(url);
    // }
    else if (value === "gengo-devnet") {
      setSelectedNetworkShortName("devnet");
      const url = "https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/";
      setSelectedNetwork(url);
    }
    else if (value === "gengo-mainnet") {
      setSelectedNetworkShortName("mainnet-beta");
      const url = "https://ssc-dao.genesysgo.net/";
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
    });

    const mints: string[] = [];

    accounts.forEach((account, i) => {
      // you had to set compiler option "noImplicitAny": false to make this work. Not proper, fix!
      const mint_id = account.account.data["parsed"]["info"]["mint"];

      // implicit filter out of non-unique / fungible or normal SPL token accounts. QTY must = 1 
      const quantity = `${account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"]}`;
      if (Number(quantity) == 1) {
        mints.push(mint_id);
      } 
      else {
      }
    });
    setAccountMints(mints);
  }

  // Drop-down menu handling for selected Mint ID
  // example source from here: https://www.kindacode.com/article/react-typescript-handling-select-onchange-event/ 
  const selectChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value;
    // @ts-expect-error
    setselectedMint(value);
  };

  // fetching NFT metadata
  // modified function taken from NFT-Armory: https://github.com/ilmoi/nft-armory
  // shout out to @_ilmoi!
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

  function urlify(input: string, network: string) {
    const output = 'https://solscan.io/account/' + input + '?cluster=' + network;
    return output;
  }

  const handleMetadata = async () => {    
    const mintId = new PublicKey(selectedMint || '') 
    const metadata = getMetadataByMint(mintId);
      
    //const pda = (await metadata).metadataPDA;
    const onChain = (await metadata).metadataOnchain;
    const external = (await metadata).metadataExternal;
      
    const name = onChain.data.name;
    const uri = onChain.data.uri;
      
    setName(name);
    setImage(external.image);
    setNFTUrl(urlify(mintId.toString(), selectedNetworkShortName));
    setMintMetadata(uri);
  
    const attributes = external.attributes; // BUG: need to handle where attributes is undefined
  
    const everyTrait: any[] = [];
    attributes.forEach((trait, i) => {
      const traitJson = JSON.parse(JSON.stringify(trait));
        if (traitJson.trait_type.toLowerCase() === "message") {
          setTraitMessage(traitJson.value);
        } else if (traitJson.trait_type === "pubkey" || traitJson.trait_type === "bkey") {
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
    try {
      if (!traitMessage) {
          throw new Error('no signature provided.');
      }

      // 1. first part is signature verification:
      const message: string = traitMessage;
      const messageArray = new Uint8Array(decodeUTF8(message));
      const signatureBase58: string = inputSignature;
      const signatureArray = new Uint8Array(bs58.decode(signatureBase58));
  
      const pubkeyBase58: string = traitPubkey;  //bs58.decode(selectedWallet.publicKey!.toString());
      const pubKeyArray = new Uint8Array(bs58.decode(pubkeyBase58));
  
      // assemble all of the components, perform the detached verify of signed message.
      const verified = await nacl.sign.detached.verify(messageArray, signatureArray, pubKeyArray);
      setSigVerified(verified);

      // 2. Next, we check and compare NFT metadata/traits against the on-chain registration   
      const connection = new Connection(selectedNetwork, 'confirmed');
      const accounts = await connection.getParsedProgramAccounts(
        MICROTITLE_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 112, // number of bytes for a microtitle registration
            },
            {
              memcmp: {
                offset: 48, // number of bytes offset to bkey starting point (type: PublicKey, 32B length)
                bytes: pubkeyBase58, // base58 encoded string
              },
            },
          ],
        }
      );

      // filter out various cases of registration, verify, and provide explanatory output.
      if ( accounts.length <= 0 ) { 
       setRegVerified(false);
       setRegCheckOutput('ERROR: no registration found!');
      }
      else if ( accounts.length === 1 ) {
        accounts.forEach((account, i) => {
          const data: any = account.account.data;
          const mint = bs58.encode(data.slice(80,112));
          if (mint === selectedMint) {
            setRegVerified(true);
            setRegCheckOutput('OK: clean registration');
          }
          else {
            setRegVerified(false);
            setRegCheckOutput('ERROR: mint ID does not match registration.');
          }
        });
      }
      // Challenging case: more than one registration. Only the earliest registration considered valid.
      else if ( accounts.length > 1 ) { 
        // finds the earliest timestamp
        let earliestTimestamp = new Number(Number.MAX_SAFE_INTEGER); 
        accounts.forEach((account, i) => {
          const data: any = account.account.data;
          const timestamp = (new Int64LE(data.slice(40,48))).toNumber();
          if ( earliestTimestamp > timestamp) {
            earliestTimestamp = timestamp;
          }
        });

        //retrieves and checks mint ID of the earliest timestamped registration ONLY.
        accounts.forEach((account, i) => {
          const data: any = account.account.data;
          const timestamp = (new Int64LE(data.slice(40,48))).toNumber();
          if ( earliestTimestamp === timestamp) {
            const mint = bs58.encode(data.slice(80,112));
            if (mint === selectedMint) {
              setRegVerified(true);
              setRegCheckOutput('OK: registration verified. WARNING: bonding key reuse found, attempted forgery likely.');
            }
            else {
              setRegVerified(false);
              let msg = 'ERROR: Registration check failed. WARNING: bonding key reuse found, this item is a likely forgery.';
              setRegCheckOutput(msg.concat(" Valid Mint ID = ", mint));
            }
          }
        });
      }
      else {
        setRegVerified(false)
        setRegCheckOutput('ERROR: Registration check failed.');
      }

    } catch (e) {
      console.warn(e);
    }
  }

  function resetFields() {
    setInputSignature('');
    setSigVerified(false);
    setRegVerified(false);
    setAccountMints([]);
    setselectedMint('');
    //setSelectedNetwork('');
    setTraitMessage('');
    setTraitPubkey('');
    setName('');
    setRegCheckOutput('');
  }

  const handleErrorWebCam = (error: string) => {
    console.log(error);
  }

  const handleScanWebCam = (result: string) => {
    if(result) {
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
            <h3>Retrieve Mint Data:</h3>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}  aria-label="network table">
            { pubkey ? (
                    <TableBody>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">                        
                          <FormControl sx={{ m: 1, width: 225 }}>
                            <InputLabel id="network-select-label">Network</InputLabel>
                            <Select
                              labelId="select-network-id"
                              variant="outlined"
                              id="selectNetworkId"
                              label="Network"
                              onChange={selectNetwork}
                            >
                              <MenuItem value={"gengo-mainnet"}>GenesysGo Mainnet</MenuItem>
                              <MenuItem value={"gengo-devnet"}>GenesysGo Devnet</MenuItem>
                              <MenuItem value={"mainnet-beta"}>Mainnet-beta</MenuItem>
                              <MenuItem value={"devnet"}>Devnet</MenuItem>
                            </Select>
                          </FormControl> 
                        </TableCell>
                        <TableCell align="right">{selectedNetwork}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">Find wallet mint IDs:</TableCell>
                        <TableCell align="right"><Button variant='outlined' onClick={getMints}>get connected mint IDs</Button></TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">Connected mints:</TableCell>
                        <TableCell align="right">
                          <FormControl sx={{ m: 1, width: 225 }}>
                            <InputLabel id="mint-select-label">Mint ID</InputLabel>
                            <Select
                              labelId="select-mint-id"
                              variant="outlined"
                              id="selectMintId"
                              label="Mint ID"
                              onChange={selectChange}
                            >
                              { accountMints.map(item => <MenuItem value={item}>{item}</MenuItem>)}
                            </Select>
                          </FormControl>       
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">Selected mint id:</TableCell>
                        <TableCell align="right">{selectedMint}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">Query metadata:</TableCell>
                        <TableCell align="right"><Button variant='outlined' onClick={handleMetadata}>get metadata!</Button></TableCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">Reset all fields:</TableCell>
                        <TableCell align="right"><Button variant='outlined' onClick={resetFields}>Reset all Fields</Button></TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                      <div><h3>Please Connect Wallet</h3></div>
                  )
            }
            </Table>
            </TableContainer>
              <h3>NFT Metadata:</h3>
              <div>
                { curName ? (
                  <div>
                    <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }}  aria-label="metadata table">
                            <TableBody>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell component="th" scope="row"><b><a href={mintMetadata} target="_blank">{ curName }</a></b></TableCell>
                                  <TableCell align="right"><b><a href={NFTUrl} target="_blank"><img src={curImage} className='nft'/></a></b> </TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell component="th" scope="row"><b>Atttributes:</b></TableCell>
                                  <TableCell align="right"></TableCell>
                                </TableRow>
                                { allTraits.map(item => 
                                  <TableRow>
                                    <TableCell component="th" scope="row">{item[0]}:</TableCell>
                                    <TableCell align="right">{item[1]}</TableCell>
                                  </TableRow>
                                )}
                            </TableBody>
                          </Table>
                      </TableContainer>
                  </div>
                ) : (
                  <><div>Connect a wallet to retrieve NFT metadata using section above, OR use manual trait entry below:</div>
                  <br/>
                  <div>
                      <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }}  aria-label="how-to table">
                            <TableBody>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell component="th" scope="row">Public Key:</TableCell>
                                  <TableCell align="right"><TextField id="outlined-basic" label="pubkey" variant="outlined" value={traitPubkey} onChange={(e) => setTraitPubkey(e.target.value.trim())} /></TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell component="th" scope="row">Message:</TableCell>
                                  <TableCell align="right"><TextField id="outlined-basic" label="message" variant="outlined" value={traitMessage} onChange={(e) => setTraitMessage(e.target.value.trim())} /></TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell component="th" scope="row">Signature:</TableCell>
                                  <TableCell align="right"><TextField id="outlined-basic" label="signature" variant="outlined" value={inputSignature} onChange={(e) => setInputSignature(e.target.value.trim())} /></TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell component="th" scope="row">Reset:</TableCell>
                                <TableCell align="right"><Button variant='outlined' onClick={resetFields}>Reset</Button></TableCell>
                                </TableRow>
                            </TableBody>
                          </Table>
                      </TableContainer>
                  </div></>
                )
                }
              </div>
              <div>
                <h3>Scan QR Code to get Signature:</h3>
                <div>
                <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 300 }}  aria-label="how-to table">
                          <TableBody>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">QR Scan:</TableCell>
                                <TableCell align="right">
                                  <div className="qrreader">
                                    <QrReader
                                      delay={300}
                                      style={{width: '100%'}}
                                      onError={handleErrorWebCam}
                                      onScan={handleScanWebCam} 
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell component="th" scope="row">Manual Signature Entry (USB reader, copy-paste):</TableCell>
                                  <TableCell align="right"><TextField id="outlined-basic" label="signature" variant="outlined" value={inputSignature} onChange={(e) => setInputSignature(e.target.value.trim())} /></TableCell>
                              </TableRow>
                              {inputSignature ? (
                                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">Signature to verify: </TableCell>
                                    <TableCell align="right">{inputSignature}</TableCell>
                                  </TableRow>
                              ) : (
                                <div></div>
                              )
                              }
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Click Button to submit:</TableCell>
                                <TableCell align="right"><Button variant='outlined' onClick={verifyItem}>Verify</Button></TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Signature Verified:</TableCell>
                                <TableCell align="right">
                                  { sigVerified ? (
                                    <h3 style={{color: "#01B688"}}> {sigVerified.toString()} </h3>
                                  ) : (
                                    <h3 style={{color: "red"}}> {sigVerified.toString()} </h3>
                                  )
                                  }
                                </TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Registration Verified:</TableCell>
                                <TableCell align="right">
                                  { regVerified ? (
                                    <h3 style={{color: "#01B688"}}> {regVerified.toString()} </h3>
                                  ) : (
                                    <h3 style={{color: "red"}}> {regVerified.toString()} </h3>
                                  )
                                  }
                                </TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell component="th" scope="row">Registration Comments:</TableCell>
                                <TableCell align="right">
                                  { regVerified ? (
                                    <h3 style={{color: "#01B688"}}> {regCheckOutput} </h3>
                                  ) : (
                                    <h3 style={{color: "red"}}> {regCheckOutput} </h3>
                                  )
                                  }
                                </TableCell>
                              </TableRow>
                          </TableBody>
                        </Table>
                    </TableContainer>
              </div>
                  
              </div>
        </div>
      </div>

  )
}

//export default Verify;