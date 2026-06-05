'use client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

export const somnia = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  rpcUrls: { default: { http: ['https://api.infra.testnet.somnia.network/'] } },
  blockExplorers: { default: { name: 'Shannon Explorer', url: 'https://shannon-explorer.somnia.network' } },
  testnet: true,
})

const { connectors } = getDefaultWallets({ appName: 'Agent Bounty Board', projectId: '20a788e6a3abb1b503745366f50e5f6c' })

const config = createConfig({
  chains: [somnia],
  connectors,
  transports: { [somnia.id]: http() },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
