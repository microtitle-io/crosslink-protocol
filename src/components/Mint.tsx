import {Container} from '@material-ui/core';

// good example on how to mint NFT w/ Arweave: https://medium.com/cypher-game/how-to-create-a-solana-nft-with-python-68f6f775f742

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Mint() {
    return (
        <div className="body">
            <div className="text">
                <h1>{`{ Mint }`}</h1>
                <h2>COMING SOON&#8482;</h2>
                <Container>
                    <div>
                        In the near future, the user will be able to mint microtitles directly from this page.  
                        Currently, the best choice is to fire up a local instance of Metaplex in order to mint your NFT.
                        Here are a few suggestions for how to create the NFT:
                        <div><br/></div>
                        <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}  aria-label="how-to table">
                          <TableBody>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 1</TableCell>
                                <TableCell align="right">Boot up Metaplex</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 2</TableCell>
                                <TableCell align="right">Select "Create"</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 3</TableCell>
                                <TableCell align="right">Upload artwork, preferably something fun, collectible, and representative of the real-world item</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 4</TableCell>
                                <TableCell align="right">When you get to the "describe your item" section, click on the "Add attribute" button</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 5</TableCell>
                                <TableCell align="right">Add two attributes with the following trait_type: pubkey, and message</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 5</TableCell>
                                <TableCell align="right">Paste the corresponding values [for each trait type above] that you obtained from signature generator on our Sign page</TableCell>
                              </TableRow>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Step 5</TableCell>
                                <TableCell align="right">Fill out the remaining info, royalties, etc, and mint the NFT!</TableCell>
                              </TableRow>
                          </TableBody>
                        </Table>
                    </TableContainer>
                        <br/>
                        Here is a <a href="https://solscan.io/token/xCeq3XCUvn4Y2RjbwnHBCHqL8sAhXrda92VG7uCMotR?cluster=devnet#metadata"> link to the first NFT microtitle</a> created using this method, as an example. <br/>
                        <br/>
                        <em>Note: this is a placeholder while we work to create each of the components for seamlessly minting microtitles directly within the app. 
                        We are providing the information for a user to mint their own NFT offline, that will be able to be verified against an item and its signature, using our Verify feature.</em>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Mint;