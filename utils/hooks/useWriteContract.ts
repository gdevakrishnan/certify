'use client';

import { useAccount, useWriteContract as useWagmiWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import contractABI from '../abi/certify.json';

interface UseWriteContractArgs {
    address: string;
    abi: any;
    functionName: string;
    args: any[];
}

interface UseWriteContractReturn {
    writeContract: (args: UseWriteContractArgs) => void;
    isPending: boolean;
    isConfirming: boolean;
    isConfirmed: boolean;
    error: any;
    hash: string | undefined;
}

const useWriteContract = (): UseWriteContractReturn => {
    const { data: hash, error, isPending, writeContract: wagmiWriteContract } =
        useWagmiWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });


    const writeContract = ({ functionName, args }: UseWriteContractArgs) => {
        const { address } = useAccount();
        
        if (address) {
            wagmiWriteContract({
                address,
                abi: contractABI,
                functionName,
                args,
            });
        } else {
            console.error('Address is undefined');
        }
    };

    return {
        writeContract,
        isPending,
        isConfirming,
        isConfirmed,
        error,
        hash,
    };
};

export default useWriteContract;
