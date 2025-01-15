import { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import contractABI from '../abi/certify.json';
import { sepolia } from 'viem/chains';
import { config } from '../config';
import { Address } from 'viem';

const CONTRACT_ADDRESS = '0x7B10654a97908d5dD3f97A0f5Af6D07b4fe6dFe5';

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
