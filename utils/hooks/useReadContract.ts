import { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import contractABI from '../abi/certify.json';
import { sepolia } from 'viem/chains';
import { config } from '../config';
import { Address } from 'viem';

const CONTRACT_ADDRESS = '0x96EC6272b3bD0c5934b150dc8ca9ea4FF0009BeA';

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
