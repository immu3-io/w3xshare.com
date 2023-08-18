import axios, { AxiosInstance } from 'axios'
import { btfsConfig } from '@/config'
import { polygonMumbai } from 'wagmi/chains'
import { configureChains, createClient } from 'wagmi'
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
const projectId = process.env.WALLET_CONNECT_PROJECT_ID
const chains = [polygonMumbai]
const { provider, webSocketProvider } = configureChains(chains, [alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY })])

export const client = createClient({
  autoConnect: false,
  connectors: w3mConnectors({
    chains,
    version: 2,
    projectId: projectId
  }),
  provider,
  webSocketProvider
})
export const ethereumClient: EthereumClient = new EthereumClient(client, chains)

export const httpClient: AxiosInstance = axios.create({
  baseURL: btfsConfig.url
})
