import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig } from 'wagmi'
import './App.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, createWagmiConfig } from '@/wagmi'
import { AttestationListView } from '@/AttestationListView'
import { Header } from './components/Header/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { useTheme } from '@/components/theme-provider'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()
const wagmiConfig = createWagmiConfig(queryClient)

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="max-w-screen-lg m-auto">
        <AttestationListView />
      </div>
    ),
  },
])

function App() {
  const { theme, setTheme } = useTheme()

  console.log(theme)
  setTheme('dark')
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Header />
            <RouterProvider router={router} />
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default App
