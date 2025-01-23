'use client';

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import contractABI from '@/utils/abi/certify.json';
import { WalletInfo } from '@/components/WalletInfo';
import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import { useWriteContract } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import { config } from '@/utils/config';

const Profile = () => {
    const CONTRACT_ADDRESS = '0x7eb9193dFAa562E7d8Fc0D236111CB03aF7a8b01';

    const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [collegeId, setCollegeId] = useState<bigint | null>(null);
    const [collegeData, setCollegeData] = useState<any | null>(null);

    const [data, setData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { address } = useAccount();


    // Web3 Write Data
    const { data: hash, error: writeError, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        fetchData();
    }, [transactionStatus, isConfirmed]);

    const handleCollege = useCallback(
        async (data: any, functionName: string) => {
            if (!address) return;

            setTransactionStatus(null);

            const args = (functionName == "removeCollegeReq") ? [
                BigInt(data.index),
            ] : [
                data.collegeAddress,
                data.collegeName,
                data.collegeDistrict,
                data.collegeState,
                BigInt(data.collegePhNo),
                BigInt(data.collegePinCode),
                BigInt(data.index),
            ];

            try {
                await writeContract({
                    address: CONTRACT_ADDRESS as `0x${string}`,
                    abi: contractABI,
                    functionName,
                    args
                });

                setTransactionStatus('Transaction submitting! please wait...');
                fetchData();
            } catch (e) {
                console.log(e);
                setTransactionStatus("Transaction Failed");
            }
        },
        [address, contractABI, writeContract]
    );

    // Web 3 Read Fetch Data
    const fetchIsAdmin = async () => {
        if (!address) return;

        try {
            const isadmin = await readContract(config, {
                abi: contractABI,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'isAdmin',
                chainId: sepolia.id,
                account: address,
            });

            setIsAdmin(isadmin as boolean);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'An error occurred');
        }
    }

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

            setData(result);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'An error occurred');
        }
    };

    const fetchCollegeId = async () => {
        if (!address) return;

        try {
            const collegeid = await readContract(config, {
                abi: contractABI,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'getCollegeIdByAddress',
                chainId: sepolia.id,
                account: address,
                args: [
                    address
                ]
            });

            setCollegeId(typeof collegeid == "bigint" ? collegeid : null);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'An error occurred');
        }
    }

    const fetchCollegeDetails = async () => {
        if (!address || !collegeId) return;

        try {
            const collegedata = await readContract(config, {
                abi: contractABI,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'getApprovedCollegeById',
                chainId: sepolia.id,
                account: address,
                args: [
                    collegeId
                ]
            });
            setCollegeData(collegedata);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'An error occurred');
        }
    }

    useEffect(() => {
        if (address) fetchCollegeId();
    }, [address]);

    useEffect(() => {
        if (address) fetchData();
    }, [address]);

    if (address) fetchCollegeId();

    if (address) fetchIsAdmin();

    useEffect(() => {
        collegeId && fetchCollegeDetails();
    }, [collegeId]);

    return (
        <section className="min-h-screen">
            {isAdmin && (<WalletInfo isadmin={isAdmin} collegeName={null} />)}
            {collegeData && (<WalletInfo isadmin={null} collegeName={collegeData.collegeName} />)}
            {!isAdmin && !collegeData && (<WalletInfo isadmin={null} collegeName={null} />)}
            {
                (!isAdmin && collegeData && collegeData.collegeName) ? (
                    <Fragment>
                        <Flex direction={'column'} className='p-6 max-w-md mx-auto my-8 rounded shadow-lg flex flex-col border-2 space-y-1'>
                            <Heading as='h1'>{collegeData.collegeName}</Heading>
                            <Text>{`${collegeData.collegeAddress.slice(0, 7)}...${collegeData.collegeAddress.slice(-5)}`}</Text>
                            <Text>{collegeData.collegeDistrict}, {collegeData.collegeState} - {collegeData.collegePinCode}</Text>
                            <Text>ph-no: {collegeData.collegePhNo}</Text>
                        </Flex>
                    </Fragment>
                ) : null
            }
            {
                (isAdmin && !collegeData && data && data.length > 0) ? (
                    <div className="p-4">
                        <Text className='mx-auto text-end block max-w-md'>Total Requests: {data.length}</Text>
                        {transactionStatus && <Text className='mx-auto text-end block max-w-md mt-2 text-green-500'>{transactionStatus}</Text>}
                        {
                            data.map((item: any, index: number) => {
                                return (
                                    <Fragment>
                                        <Flex direction={'column'} className='p-6 max-w-md mx-auto my-8 rounded shadow-lg flex flex-col border-2 space-y-1' key={index}>
                                            <Heading as='h1'>{item.collegeName}</Heading>
                                            <Text>{`${item.collegeAddress.slice(0, 7)}...${item.collegeAddress.slice(-5)}`}</Text>
                                            <Text>{item.collegeDistrict}, {item.collegeState} - {item.collegePinCode}</Text>
                                            <Text>ph-no: {item.collegePhNo}</Text>
                                            <Flex justify={'end'} gap={'4'}>
                                                <Button onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCollege({ ...item, index }, "removeCollegeReq");
                                                }}>Decline</Button>
                                                <Button onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCollege({ ...item, index }, "createCollege");
                                                }}>Approve</Button>
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
