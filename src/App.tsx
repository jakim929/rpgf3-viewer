import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig } from 'wagmi'
import './App.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, createWagmiConfig } from '@/wagmi'
import { AttestationListView } from '@/AttestationListView'

const queryClient = new QueryClient()
const wagmiConfig = createWagmiConfig(queryClient)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          Hello world
          <AttestationListView />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default App
