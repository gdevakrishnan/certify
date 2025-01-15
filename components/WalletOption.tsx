'use client'
import { Box, Button, Heading } from '@radix-ui/themes';
import { Fragment } from 'react';
import { useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <Fragment>
      <section className='py-4 justify-center items-center flex'>
        <Box className="flex flex-col space-y-4 p-6 max-w-md mx-auto my-8 rounded shadow-lg border-2 w-[300px] justify-center items-center">
          <Heading as='h1'>Connect Wallet</Heading>
          {
            connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={(e) => {
                  e.preventDefault();
                  connect({ connector });
                }}
                className="px-8 py-2 w-full"
              >
                {connector.name}
              </Button>
            ))
          }
        </Box>
      </section>
    </Fragment>
  );
}