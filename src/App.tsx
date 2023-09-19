import { WagmiConfig } from 'wagmi'
import './App.css'
import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, wagmiConfig } from '@/wagmi'

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        Hello world <ConnectButton />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
