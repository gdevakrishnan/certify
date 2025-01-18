'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import contractABI from '@/utils/abi/certify.json';
import { WalletInfo } from '@/components/WalletInfo';
import { config } from '@/utils/config';
import { Box, Button, Flex, Heading, Text } from '@radix-ui/themes';

const Profile: React.FC = () => {
    const CONTRACT_ADDRESS = '0x7863c103EC0B4B7c3B78F566a1b81f56094337B1';

    const [data, setData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { address } = useAccount();

    const fetchData = async () => {
        if (!address) return;

        try {
            const result = await readContract(config, {
                abi: contractABI,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'getAllRequestedColleges',
                chainId: sepolia.id,
                account: address,
            });

            console.log('Fetched Data:', result);
            setData(result);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'An error occurred');
        }
    };

    useEffect(() => {
        if (address) {
            fetchData();
        }
    }, [address]);

    return (
        <section className="min-h-screen">
            <WalletInfo />
            {
                (data && data.length > 0) ? (
                    <div className="p-4">
                        <Text className='mx-auto text-end block max-w-md'>Total Requests: {data.length}</Text>
                        {
                            data.map((item: any, index: number) => {
                                return (
                                    <Fragment>
                                        <Flex direction={'column'} className='p-6 max-w-md mx-auto my-8 rounded shadow-lg flex flex-col border-2 space-y-1'>
                                            <Heading as='h1'>{item.collegeName}</Heading>
                                            <Text>{`${item.collegeAddress.slice(0, 7)}...${item.collegeAddress.slice(-5)}`}</Text>
                                            <Text>{item.collegeDistrict}, {item.collegeState} - {item.collegePinCode}</Text>
                                            <Text>ph-no: {item.collegePhNo}</Text>
                                            <Flex justify={'end'} gap={'4'}>
                                                <Button>Decline</Button>
                                                <Button>Approve</Button>
                                            </Flex>
                                        </Flex>
                                    </Fragment>
                                )
                            })
                        }
                    </div>
                ) : null
            }
        </section>
    );
};

export default Profile;
