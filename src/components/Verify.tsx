import React, { useEffect, useMemo, useState } from 'react';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { SendOneLamportToRandomAddress } from './walletTest';

function Verify() {
    return (
        <div>
            <h1>{`{ Verify }`}</h1>
            <div className="text">
                <SendOneLamportToRandomAddress />
            </div>
        </div>
    )
}

export default Verify;