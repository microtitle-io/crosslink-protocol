import qrcode from '../qrcode.png';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {Routes, Route, Link} from 'react-router-dom';


function Home() {
    return (
        <div className="body" style={{minWidth: '60%'}}>
            <div className='text' >
                <h1>{`{ Crosslink Protocol }`}</h1>
                NFT titles for durable goods, secured by the Solana blockchain.
                    <h2>How does it work?</h2>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}  aria-label="how-to table">
                          <TableBody>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 1: <a href="/sign">Sign</a></TableCell>
                                <TableCell align="right">Create a bonding keypair, create a signature (QR code), and attach it to your item.</TableCell>
                                {/* <TableCell align="right">Create a bonding keypair, create a signature (2D QR code), and attach to your item.<br/><img src={qrcode} className="qrcode" alt="Example QR code signature." /></TableCell> */}
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 2: <a href="/mint">Mint</a></TableCell>
                                <TableCell align="right"> Mint the NFT "microtitle."</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 3: <a href="/register">Register</a></TableCell>
                                <TableCell align="right">Use our smart contract to "link" the NFT mint ID to the item's bonding key.</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 4: <a href="/verify">Verify</a></TableCell>
                                <TableCell align="right"> Verify signature against the microtitle at any time!</TableCell>
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