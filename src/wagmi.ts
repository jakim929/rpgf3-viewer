import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { optimism } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { QueryClient } from '@tanstack/react-query'

const { chains, publicClient } = configureChains(
  [optimism],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY! }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
})

export const createWagmiConfig = (queryClient: QueryClient) =>
  createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    queryClient,
  })

export { chains }
