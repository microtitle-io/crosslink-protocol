import React from 'react';

function Mint() {
    return (
        <div className="body">
            <div className="text">
                <h1>{`{ Mint }`}</h1>
                <h2>COMING SOON&#8482;</h2>
                <div>
                    In the near future, the user will be able to mint microtitles directly from this page.  
                    Currently, the best choice is to fire up a local instance of Metaplex in order to mint your NFT.
                    Here are a few suggestions for how to create the NFT:
                    <ol>
                        <li>Boot up Metaplex</li>
                        <li>Select "Create"</li>
                        <li>Upload artwork, preferably something fun, collectible, and representative of the real-world item</li>
                        <li>When you get to the "describe your item" section, click on the "Add attribute" button</li>
                        <li>Add two attributes with the following trait_type: pubkey, and message</li>
                        <li>Paste the corresponding values [for each trait type above] that you obtained from signature generator on our Sign page</li>
                        <li>Fill out the remaining info, royalties, etc, and mint the NFT!</li>
                    </ol> 
                    Here is a <a href="https://solscan.io/token/9LwKNcN1aLuDpLvKHpgCpF1QMAeaPAThKFuyHfBKkFk8?cluster=devnet#metadata"> link to the first NFT microtitle</a> created using this method, as an example. <br/>
                    <br/>
                    Note: this page is just a placeholder while we work to create each of the components for seamlessly minting, and verifying microtitles using this web app. 
                    We are providing the information for a user to mint their own NFT offline, that will be able to be verified against an item and its signature. But please check back soon, 
                    as we are working to create a more integrated experience.
                </div>
            </div>
        </div>
    )
}

export default Mint;