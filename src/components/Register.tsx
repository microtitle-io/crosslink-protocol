import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@mui/material/Table/Table';
import TableBody from '@mui/material/TableBody/TableBody';
import TableCell from '@mui/material/TableCell/TableCell';
import TableContainer from '@mui/material/TableContainer/TableContainer';
import TableHead from '@mui/material/TableHead/TableHead';
import TableRow from '@mui/material/TableRow/TableRow';
import Paper from '@mui/material/Paper/Paper';

import {
  Connection,
  PublicKey,
  clusterApiUrl,
} from '@solana/web3.js';

// configuring to interface with XLP Register [anchor] program
import * as anchor from '@project-serum/anchor';
import idl from '../idl/register.json'; 
export const MICROTITLE_PROGRAM_ID = new PublicKey('KdWVDYMteVwTbBNZGfCkS2ayCFEWhbkBoFZxPwdqCgu');
import { useAnchorWallet } from "@solana/wallet-adapter-react";

// utils
import bs58 from 'bs58';
import { Int64LE } from 'int64-buffer';

function Register() {

  // use connected anchor wallet
  const wallet = useAnchorWallet(); //It’s not exported in a typescript friendly way. You can @ts-ignore and it will run. 
  const pubkey = wallet?.publicKey;
  
  // bunch of misc state variables
  const [bondingKey, setBondingKey] = useState('');
  const [mintId, setMintId] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('https://api.devnet.solana.com');
  const [selectedNetworkShortName, setSelectedNetworkShortName] = useState('devnet');
  const [txid, setTxid] = useState('');
  const [bondingKeySearch, setBondingKeySearch] = useState('');
  const [searchAccounts, setSearchAccounts] = useState(['']);

  // configure the anchor program
  const connection = new anchor.web3.Connection(selectedNetwork, anchor.Provider.defaultOptions().preflightCommitment)
  // @ts-expect-error
  const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions().preflightCommitment);
  // @ts-expect-error
  const program = new anchor.Program(idl, MICROTITLE_PROGRAM_ID, provider);
    
  // Select the network to draw on-chain data from:
  const selectNetwork = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedNetworkShortName(value);
    if (value === "localhost") {
      const url = "http://127.0.0.1:8899";
        setSelectedNetwork(url);
      }
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

  function resetFields() {
    setTxid('');
    setBondingKey('');
    setBondingKeySearch('');
    setMintId('');
    setSearchAccounts([]);
  }

  async function updateRegister() {
     try {
         if (!wallet) {
           throw new Error('wallet not connected');
         }

         // create new registration account, to embed the bonding key and mint id in
         const utitle = anchor.web3.Keypair.generate();
         const bkey = new PublicKey(bondingKey);
         const mint = new PublicKey(mintId);
         const REGISTRAR_PUBKEY = new PublicKey('HSMaqKWmpKtibZrukaE4X3HatNDUYkzg39y2kri3PRTh');

         // script checks for duplicate bonding key on-chain. 
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
                    bytes: bkey.toBase58(), // base58 encoded string
                  },
                },
              ],
            }
          );

          // only if the bonding key is not registered will the app allow you to submit the tx.
          if ( accounts.length === 0 ) {
           const txid = await program.rpc.updateRegister(bkey, mint, {
             accounts: {
                 microtitle: utitle.publicKey,
                 author: wallet.publicKey,
                 registrar: REGISTRAR_PUBKEY,
                 systemProgram: anchor.web3.SystemProgram.programId,
             },
             signers: [utitle],
           });
           setTxid(txid);
          } else {
            setTxid('Error: registration already found!');
          }

      } catch (e) {
          console.warn(e);
      }
  }

  function shortify(input: string) {
    const output = input.substring(0, 4) + '...' + input.substring(input.length - 4);
    return output;
  }

  function urlify(input: string, network: string) {
    const output = 'https://solscan.io/account/' + input + '?cluster=' + network;
    return output;
  }

  async function search() {
    // script checks for duplicate bonding key on-chain. 
    const bkeySearch = new PublicKey(bondingKeySearch);
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
              bytes: bkeySearch.toBase58(), // base58 encoded string
            },
          },
        ],
      }
    );
    const result: any[] = [];
    if ( accounts.length > 0 ) {
      accounts.forEach((account, i) => {
        //Registration account data format is:
          // 8B discriminant -- offset = 0
          // 32B author - PublicKey -- offset = 8
          // 8B timestamp - Clock.unixtimestamp, i64 -- -- offset = 40
          // 32B bkey - PublicKey -- offset = 48
          // 32B mint - PublicKey -- offset = 80
          // = 112B total
        const data: any = account.account.data; // this is the ticket --> account data already here. Just need to access it!

        // get the registration's author
        const author = bs58.encode(data.slice(8, 40));

        // get time
        const timestampBuffer = data.slice(40, 48);
        const timestampInt64 = new Int64LE(timestampBuffer);
        const timestamp = timestampInt64.toString(10) + ""; // base10, needs + "" to display correctly b/c IEEE-754 only has 54 bit precision or something. 

        // microtitle data
        const bkey = bs58.encode(data.slice(48, 80));
        const mint = bs58.encode(data.slice(80, 112));

        // registration account pubkey
        const reg = account.pubkey.toString();

        // making addresses easier on the eyes
        const regShort = shortify(reg);
        const authorShort = shortify(author);
        const bkeyShort = shortify(bkey);
        const mintShort = shortify(mint);
        const regURL = urlify(reg, selectedNetworkShortName); 
        const authorURL = urlify(author, selectedNetworkShortName);
        const mintURL = urlify(mint, selectedNetworkShortName);

        result.push([regShort, regURL, authorShort, authorURL, timestamp, bkeyShort, mintShort, mintURL]);
      });
      setSearchAccounts(result);
    }
    else {
      setSearchAccounts(['']);
    }      
  }

  return (  
      <div className="body" style={{minWidth: '80%'}}>
          <div className="text">
              <h1 style={{color: '#FFFFFF'}}>{`{ Register }`}</h1>
              <div className="text">
                  The final step in securing a microtitle is to use this page to create an on-chain Register entry that ties the NFT microtitle to the real-world asset's bonding key. <br/>
                  <br/>
                  { pubkey ? (
                      <div>
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}  aria-label="register table">
                              <TableBody>
                                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">Connected Wallet:</TableCell>
                                    <TableCell component="th" scope="row"></TableCell>
                                    <TableCell align="right">{pubkey.toBase58()}</TableCell> 
                                    {/* <TableCell component="th" scope="row"> <div>{pubkey}</div> </TableCell> */}
                                  </TableRow>
                                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="left">                          
                                        <select 
                                            id="selectNetworkId"
                                            onChange={selectNetwork}
                                        >
                                          <option selected disabled>SELECT NETWORK</option>
                                          <option value={"localhost"}>localhost</option>
                                          <option value={"devnet"}>devnet</option>
                                          <option value={"mainnet-beta"}>mainnet-beta</option>
                                          <option value={"testnet"}>testnet</option>
                                        </select>
                                    </TableCell>
                                    <TableCell component="th" scope="row"></TableCell>
                                    <TableCell component="th" scope="row" align="right">{selectedNetwork}</TableCell>
                                  </TableRow>
                                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row"><TextField id="outlined-basic" label="bonding pubkey" variant="outlined" value={bondingKey} onChange={(e) => setBondingKey(e.target.value.trim())} /></TableCell>
                                    <TableCell component="th" scope="row"><TextField id="outlined-basic" label="mint id" variant="outlined" value={mintId} onChange={(e) => setMintId(e.target.value.trim())} /></TableCell>
                                    <TableCell align="right"><Button onClick={updateRegister}>Register Microtitle</Button></TableCell>
                                  </TableRow>
                                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">Reset Fields:</TableCell>
                                    <TableCell component="th" scope="row"></TableCell>
                                    <TableCell component="th" scope="row" align="right"><Button onClick={resetFields}>Reset Form</Button></TableCell>
                                  </TableRow>
                                  { txid ? ( <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">tx submitted:</TableCell>
                                                <TableCell component="th" scope="row" align="right">{txid}</TableCell>
                                                <TableCell component="th" scope="row"></TableCell>
                                              </TableRow>
                                    ) : (
                                      <div></div>
                                    )
                                  }
                              </TableBody>
                            </Table>
                          </TableContainer>
                      </div>
                  ) : (
                      <div>
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}  aria-label="register table">
                              <TableBody>
                                  <div><h3>Please Connect Wallet</h3></div>
                              </TableBody>
                            </Table>
                          </TableContainer>
                      </div>
                  )
                  }
                  <br/>
                  <div>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}  aria-label="search table">
                          <TableBody>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Search for a registration:</TableCell>
                                <TableCell component="th" scope="row"><TextField id="outlined-basic" label="bonding pubkey" variant="outlined" value={bondingKeySearch} onChange={(e) => setBondingKeySearch(e.target.value.trim())} /></TableCell>
                                <TableCell component="th" scope="row"></TableCell>
                                <TableCell component="th" scope="row"></TableCell>
                                <TableCell align="right"><Button onClick={search}>Search</Button></TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell component="th" scope="row">Account</TableCell>
                                  <TableCell component="th" scope="row">Registrant</TableCell>
                                  <TableCell component="th" scope="row">Timestamp</TableCell>
                                  <TableCell component="th" scope="row">Bkey</TableCell>
                                  <TableCell align="right">Mint</TableCell>
                                </TableRow>
                              { searchAccounts.map(item => 
                                <TableRow>
                                  <TableCell component="th" scope="row"><a href={item[1]}  target="_blank">{item[0]}</a></TableCell>
                                  <TableCell component="th" scope="row"><a href={item[3]}  target="_blank">{item[2]}</a></TableCell>
                                  <TableCell component="th" scope="row">{item[4]}</TableCell>
                                  <TableCell component="th" scope="row">{item[5]}</TableCell>
                                  <TableCell align="right"><a href={item[7]}  target="_blank">{item[6]}</a></TableCell>
                                </TableRow>
                              )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                  </div>
              </div>
          </div>
      </div>
  )
}
export default Register;
