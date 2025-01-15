import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export function getConfig() {
    return createConfig({
        chains: [sepolia],
        transports: {
            // [mainnet.id]: http(),
            [sepolia.id]: http(),
        },
        connectors: [coinbaseWallet(), injected(), walletConnect({
            projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? ''
        })],
        storage: createStorage({
            storage: cookieStorage
        }),
        ssr: true
    })
}

export const config = createConfig({
    chains: [sepolia],
    transports: {
        // [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
    connectors: [coinbaseWallet(), injected(), walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? ''
    })],
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true
})

declare module 'wagmi' {
    interface Register {
        config: ReturnType<typeof getConfig>
    }
}

// Get the project id for Wallet access from: https://cloud.reown.com