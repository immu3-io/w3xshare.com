import { IAppConfig, IAuthGuardOptions, IBtfsConfig, INftConfig, IPollinationXConfig } from '@/config/types'
import { ThemeCtrlState } from '@web3modal/core/dist/_types/src/types/controllerTypes'

export const appConfig: IAppConfig = {
  locale: 'en'
}

export const authGuardOptions: IAuthGuardOptions = {
  publicPaths: ['/']
}

export const pollinationXConfig: IPollinationXConfig = {
  url: process.env.POLLINATIONX_URL,
  token: process.env.POLLINATIONX_TOKEN,
  auth: {
    message: 'This request will check your PollinationX storage NFT and it will not trigger a blockchain transaction or cost any gas fees.'
  },
  newNft: {
    message: 'NEW NFT: This request will check your PollinationX storage NFT and it will not trigger a blockchain transaction or cost any gas fees.'
  }
}

export const nftConfig: INftConfig = {
  contract: process.env.NFT_COLLECTION_CONTRACT
}

export const btfsConfig: IBtfsConfig = {
  url: process.env.BTFS_URL
}

export const themeConfig: ThemeCtrlState = {
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent-color': '#888888',
    '--w3m-background-color': 'black'
  }
}
