import {
  arbitrum,
  baseGoerli,
  mainnet,
  optimism,
  optimismGoerli,
  sepolia,
} from 'viem/chains'

export const EASScanBaseUrls: Record<number, string> = {
  [mainnet.id]: 'https://easscan.org',
  [optimism.id]: 'https://optimism.easscan.org',
  [arbitrum.id]: 'https://arbitrum.easscan.org',
  [sepolia.id]: 'https://sepolia.easscan.org',
  [optimismGoerli.id]: 'https://optimism-goerli-bedrock.easscan.org',
  [baseGoerli.id]: 'https://base-goerli.easscan.org',
}
