'use client' // Make sure this is at the very top

import { Button } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

export function WalletInfo() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  return isConnected ? (
    <Fragment>
      <div className="my-4 flex flex-col gap-2 text-center justify-center items-center">
        <span className="text-2xl opacity-75">Wallet Address</span>
        <span className="text-xl">{address}</span>
        <Button
          onClick={(e) => {
            e.preventDefault();
            disconnect();
            router.push('/'); // This should work once the router is mounted
          }}
          className="px-8 py-2"
        >
          Disconnect
        </Button>
      </div>
    </Fragment>
  ) : null;
}
