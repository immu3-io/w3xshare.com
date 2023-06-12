export interface IAppConfig {
  locale: string
}

export interface IAuthGuardOptions {
  publicPaths: string[]
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

export interface INftConfig {
  contract: string
}

export interface IBtfsConfig {
  url: string
}