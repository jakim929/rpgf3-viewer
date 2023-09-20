import {
  arbitrum,
  baseGoerli,
  mainnet,
  optimism,
  optimismGoerli,
  sepolia,
} from 'viem/chains'

export const EASGraphqlEndpoints: Record<number, string> = {
  [mainnet.id]: 'https://easscan.org/graphql',
  [optimism.id]: 'https://optimism.easscan.org/graphql',
  [arbitrum.id]: 'https://arbitrum.easscan.org/graphql',
  [sepolia.id]: 'https://sepolia.easscan.org/graphql',
  [optimismGoerli.id]: 'https://optimism-goerli-bedrock.easscan.org/graphql',
  [baseGoerli.id]: 'https://base-goerli.easscan.org/graphql',
}
