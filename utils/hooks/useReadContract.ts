import { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import contractABI from '../abi/certify.json';
import { sepolia } from 'viem/chains';
import { config } from '../config';
import { Address } from 'viem';

const CONTRACT_ADDRESS = '0x7eb9193dFAa562E7d8Fc0D236111CB03aF7a8b01';

export const useReadContract = (functionName: string, account : Address | undefined) => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await readContract(config, {
          abi: contractABI,
          address: CONTRACT_ADDRESS,
          functionName,
          chainId: sepolia.id,
          account,
        });
        setData(result);
      } catch (err) {
        setError(err);
      }
    };

    if (account) fetchData(); 
  }, [functionName, account]);

  return { data, error };
};
