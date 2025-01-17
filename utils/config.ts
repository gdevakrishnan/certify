import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains'; // Import only Sepolia if you're focusing on it
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'; // All connectors you want to support

const sepoliaRpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_WC_ALCHEMI_KEY}`;

export function getConfig() {
    return createConfig({
        chains: [sepolia], // Set to Sepolia Testnet
        transports: {
            [sepolia.id]: http(sepoliaRpcUrl ?? ''),
        },
        connectors: [
            // Define connectors to support MetaMask, Coinbase, and WalletConnect
            coinbaseWallet(),
            injected(),
            walletConnect({
                projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? '', // Ensure your projectId is set
            }),
        ],
        storage: createStorage({
            storage: cookieStorage, // Using cookies for storage
        }),
        ssr: true, // Enable Server-Side Rendering (optional)
    });
}

export const config = createConfig({
    chains: [sepolia], // Set to Sepolia Testnet
    transports: {
        [sepolia.id]: http(sepoliaRpcUrl ?? ''),
    },
    connectors: [
        coinbaseWallet(), // Coinbase Wallet connector
        injected(), // MetaMask / Injected connector
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? '', // WalletConnect project ID
        }),
    ],
    storage: createStorage({
        storage: cookieStorage, // Storage for session management
    }),
    ssr: true, // Enable SSR support
});

declare module 'wagmi' {
    interface Register {
        config: ReturnType<typeof getConfig>;
    }
}

// Get the project id for Wallet access from: https://cloud.reown.com