export interface IAppConfig {
  locale: string
}

export interface IAuthGuardOptions {
  publicPaths: string[]
}

export interface IBtfsConfig {
  url: string
}

export interface INetworkOptions {
  explorerUrl: string
}

interface IPollinationXAuthOptions {
  message: string
}

export interface IPollinationXConfig {
  url: string
  token: string
  auth: IPollinationXAuthOptions
  newNft: IPollinationXAuthOptions
}
