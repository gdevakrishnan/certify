'use client'
import { Button, Flex, Heading } from '@radix-ui/themes';
import { Fragment } from 'react';
import { useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <Fragment>
      <section className='py-4 justify-center items-center flex'>
        <Flex direction={"column"} gap={"2"} width={"250px"}>
          <Heading as='h1' align={"center"} className='mb-2'>Connect Wallet</Heading>
          {
            connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={(e) => {
                  e.preventDefault();
                  connect({ connector });
                }}
                className="px-8 py-4"
              >
                {connector.name}
              </Button>
            ))
          }
        </Flex>
      </section>
    </Fragment>
  );
}