import axios, { AxiosInstance } from 'axios'
import { btfsConfig } from '@/config'
import { polygonMumbai } from 'wagmi/chains'
import { configureChains, createClient } from 'wagmi'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Chain } from 'wagmi'

const artheraTestnet = {
  id: 10243,
  testnet: true,
  name: 'Arthera Testnet',
  network: 'Arthera Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Arthera Testnet',
    symbol: 'AA'
  },
  rpcUrls: {
    public: { http: ['https://rpc-test2.arthera.net/'] },
    default: { http: ['https://rpc-test2.arthera.net/'] }
  },
  blockExplorers: {
    etherscan: { name: 'Arthera Testnet', url: 'https://explorer-test2.arthera.net' },
    default: { name: 'Arthera Testnet', url: 'https://explorer-test2.arthera.net' }
  }
} as const satisfies Chain

const sepolia = {
  id: 11155111,
  testnet: true,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'SEP'
  },
  rpcUrls: {
    public: { http: ['https://eth-sepolia.g.alchemy.com/v2/zZVxJK0XZZZIOH1SAOfS9Kz2Q6mqF2OA'] },
    default: { http: ['https://eth-sepolia.g.alchemy.com/v2/zZVxJK0XZZZIOH1SAOfS9Kz2Q6mqF2OA'] }
  },
  blockExplorers: {
    etherscan: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' }
  }
} as const satisfies Chain

const immu3Testnet = {
  id: 3100,
  testnet: true,
  name: 'Immu3 EVM TestNet',
  network: 'Immu3 EVM TestNet',
  nativeCurrency: {
    decimals: 18,
    name: 'IMMU',
    symbol: 'IMMU'
  },
  rpcUrls: {
    public: { http: ['https://fraa-dancebox-3043-rpc.a.dancebox.tanssi.network/'] },
    default: { http: ['https://fraa-dancebox-3043-rpc.a.dancebox.tanssi.network/'] }
  },
  blockExplorers: {
    etherscan: { name: 'Immu3 EVM TestNet', url: 'https://polkadot.js.org/apps/?rpc=wss://fraa-dancebox-3043-rpc.a.dancebox.tanssi.network#/explorer' },
    default: { name: 'Immu3 EVM TestNet', url: 'https://polkadot.js.org/apps/?rpc=wss://fraa-dancebox-3043-rpc.a.dancebox.tanssi.network#/explorer' }
  }
} as const satisfies Chain

const oasisSapphireTestnet = {
  id: 23295,
  testnet: true,
  name: 'Oasis Sapphire Testnet',
  network: 'Oasis Sapphire Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'oasisSapphireTEST',
    symbol: 'oasisSapphireTEST'
  },
  rpcUrls: {
    public: { http: ['https://testnet.sapphire.oasis.dev/'] },
    default: { http: ['https://testnet.sapphire.oasis.dev/'] }
  },
  blockExplorers: {
    etherscan: { name: 'Oasis Sapphire Testnet', url: 'https://testnet.explorer.sapphire.oasis.dev' },
    default: { name: 'Oasis Sapphire Testnet', url: 'https://testnet.explorer.sapphire.oasis.dev' }
  }
} as const satisfies Chain

const metisGoerliTestnet = {
  id: 599,
  testnet: true,
  name: 'Metis Goerli Testnet',
  network: 'Metis Goerli Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tMETIS',
    symbol: 'tMETIS'
  },
  rpcUrls: {
    public: { http: ['https://goerli.gateway.metisdevops.link/'] },
    default: { http: ['https://goerli.gateway.metisdevops.link/'] }
  },
  blockExplorers: {
    etherscan: { name: 'Metis Goerli Testnet', url: 'https://goerli.explorer.metisdevops.link' },
    default: { name: 'Metis Goerli Testnet', url: 'https://goerli.explorer.metisdevops.link' }
  }
} as const satisfies Chain

const beresheetEVM = {
  id: 2022,
  testnet: true,
  name: 'BeresheetEVM',
  network: 'BeresheetEVM',
  nativeCurrency: {
    decimals: 18,
    name: 'TEDG',
    symbol: 'TEDG'
  },
  rpcUrls: {
    public: { http: ['https://beresheet-evm.jelliedowl.net/'] },
    default: { http: ['https://beresheet-evm.jelliedowl.net/'] }
  },
  blockExplorers: {
    etherscan: { name: 'BeresheetEVM Testnet', url: 'https://testnet.edgscan.live' },
    default: { name: 'BeresheetEVM Testnet', url: 'https://testnet.edgscan.live' }
  }
} as const satisfies Chain

const mantleTestnet = {
  id: 5001,
  testnet: true,
  name: 'MantleTestnet',
  network: 'MantleTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT'
  },
  rpcUrls: {
    public: { http: ['https://rpc.testnet.mantle.xyz/'] },
    default: { http: ['https://rpc.testnet.mantle.xyz/'] }
  },
  blockExplorers: {
    etherscan: { name: 'Mantle Testnet', url: 'https://explorer.testnet.mantle.xyz' },
    default: { name: 'Mantle Testnet', url: 'https://explorer.testnet.mantle.xyz' }
  }
} as const satisfies Chain

const zetachainTestnet = {
  id: 7001,
  testnet: true,
  name: 'ZetachainTestnet',
  network: 'ZetachainTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ZETA',
    symbol: 'ZETA'
  },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/zetachain_evm_athens_testnet/'] },
    default: { http: ['https://rpc.ankr.com/zetachain_evm_athens_testnet/'] }
  },
  blockExplorers: {
    etherscan: { name: 'Zetachain Testnet', url: 'https://explorer.zetachain.com' },
    default: { name: 'Zetachain Testnet', url: 'https://explorer.zetachain.com' }
  }
} as const satisfies Chain

//
// const edgeEVM = {
//   id: 2021,
//   name: 'EdgeEVM',
//   network: 'EdgeEVM',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'EDG',
//     symbol: 'EDG'
//   },
//   rpcUrls: {
//     public: { http: ['https://edgeware-evm.jelliedowl.net/'] },
//     default: { http: ['https://edgeware-evm.jelliedowl.net/'] }
//   },
//   blockExplorers: {
//     etherscan: { name: 'Edgeware', url: 'https://edgscan.live' },
//     default: { name: 'Edgeware', url: 'https://edgscan.live' }
//   }
// } as const satisfies Chain

const projectId = process.env.WALLET_CONNECT_PROJECT_ID
const chains = [sepolia, artheraTestnet, immu3Testnet, polygonMumbai, oasisSapphireTestnet, metisGoerliTestnet, beresheetEVM, mantleTestnet, zetachainTestnet]
const { provider, webSocketProvider } = configureChains(chains, [w3mProvider({ projectId: process.env.WALLET_CONNECT_PROJECT_ID })])

export const client = createClient({
  autoConnect: true,
  connectors: w3mConnectors({
    chains,
    projectId: projectId
  }),
  provider,
  webSocketProvider
})
export const ethereumClient: EthereumClient = new EthereumClient(client, chains)

export const httpClient: AxiosInstance = axios.create({
  baseURL: btfsConfig.url
})
