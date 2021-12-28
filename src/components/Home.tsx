import React from 'react';
import qrcode from '../qrcode.png';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function Home() {
    return (
        <div className="body" style={{minWidth: '60%'}}>
            <div className='text' >
                <h1 style={{color: '#FFFFFF'}}>{`{ Crosslink Protocol }`}</h1>
                NFT titles for durable goods, secured by the Solana blockchain.
                    <h2>How does it work?</h2>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}  aria-label="how-to table">
                          <TableBody>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 1</TableCell>
                                <TableCell align="right">Create a "bonding" keypair</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 2</TableCell>
                                <TableCell align="right">Generate signature (2D QR code)<br/><img src={qrcode} className="qrcode" alt="Example QR code signature." /></TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 3</TableCell>
                                <TableCell align="right">Permanently attach signature to item</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 4</TableCell>
                                <TableCell align="right">Mint the NFT "microtitle"</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 5</TableCell>
                                <TableCell align="right">Verify signature against the microtitle at any time!</TableCell>
                              </TableRow>
                          </TableBody>
                        </Table>
                    </TableContainer>
                    <br/>
            </div>
        </div>
    )
}

export default Home;