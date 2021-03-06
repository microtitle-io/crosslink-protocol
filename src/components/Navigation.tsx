import { Toolbar } from '@material-ui/core';
import { LinkOff } from '@material-ui/icons';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-material-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';

const Navigation: FC = () => {
  const { wallet } = useWallet();

  return (
    <Toolbar className="wallet" style={{ display: 'flex' }}>
        <WalletMultiButton style={{backgroundColor: '#15171b', color: '#01B688',  border: '1px solid #2e3472'}}/>
        {wallet && <WalletDisconnectButton startIcon={<LinkOff />} style={{ marginLeft: 8, backgroundColor: '#15171b', color: '#01B688',  border: '1px solid #2e3472' }} />}
    </Toolbar>
  );
};

export default Navigation;