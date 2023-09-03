import { IAppConfig, IAuthGuardOptions, IBtfsConfig, INetworkOptions, IPollinationXConfig } from '@/config/types'
import { ThemeCtrlState } from '@web3modal/core/dist/_types/src/types/controllerTypes'

export const themeConfig: ThemeCtrlState = {
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent-color': '#888888',
    '--w3m-background-color': 'black'
  }
}

export const appConfig: IAppConfig = {
  locale: 'en'
}

export const authGuardOptions: IAuthGuardOptions = {
  publicPaths: ['/']
}

export const btfsConfig: IBtfsConfig = {
  url: process.env.BTFS_URL
}

export const networkOptions: INetworkOptions = {
  explorerUrl: 'https://sepolia.etherscan.io/tx/'
}

export const pollinationXConfig: IPollinationXConfig = {
  url: process.env.POLLINATIONX_URL,
  token: process.env.POLLINATIONX_TOKEN,
  auth: {
    message: 'This request will check your PollinationX (PX) storage NFTs and it will not trigger a blockchain transaction or cost any gas fees.'
  },
  newNft: {
    message: 'This request will check your PollinationX (PX) storage NFTs and it will not trigger a blockchain transaction or cost any gas fees.'
  }
}
