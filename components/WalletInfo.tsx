'use client' // Make sure this is at the very top

import { Button, Text } from '@radix-ui/themes';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

interface WalletInfoProps {
  isadmin: boolean | null;
  collegeName: string | null;
}

export function WalletInfo({ isadmin, collegeName }: WalletInfoProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const currentPath = usePathname();

  return isConnected ? (
    <Fragment>
      <div className="my-4 flex flex-col gap-2 text-center justify-center items-center">
        {
          (currentPath == '/connect') ? <Text className="text-2xl opacity-75">Wallet Address</Text> : <Text className="text-2xl opacity-75">Hello '{isadmin ? 'Admin' : collegeName}</Text>
        }
        <Text className="text-xl">{address}</Text>
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
