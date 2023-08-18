import { TransactionReceipt } from '@ethersproject/abstract-provider/src.ts'

export interface IError {
  error?: any
}

export interface ISignAuth {
  chain: string
  nonce: string
  signature: string
}

export interface IDoWriteContract extends IError {
  hash?: string
  wait?: (confirmations?: number) => Promise<TransactionReceipt>
}

interface IOpenSea {
  lastIngestedAt: string
}

interface IToken {
  tokenId: string
  tokenMetadata: ITokenMetadata
}

interface ITokenMetadata {
  tokenType: string
}

interface IMedia {
  bytes: number
  format: string
  gateway: string
  raw: string
  thumbnail: string
}

interface IMetadataAttribute {
  display_type?: string
  trait_type: string
  value: string | number
}

interface IMetadata {
  attributes: IMetadataAttribute[]
  description: string
  image: string
  name: string
}

interface ITokenUri {
  gateway: string
  raw: string
}

interface IContract {
  address: string
}

interface IContractMetadata {
  contractDeployer: string
  deployedBlockNumber: number
  name: string
  openSea: IOpenSea
  symbol: string
  tokenType: string
}

export interface IGetNft extends IError {
  nfts?: INft[]
  success?: boolean
  totalCount?: number
}

export interface INft {
  balance: string
  contract: IContract
  contractMetadata: IContractMetadata
  description: string
  endpoint: string
  id: IToken
  jwt: string
  media?: IMedia[]
  metadata: IMetadata
  timeLastUpdated: string
  title: string
  tokenUri: ITokenUri
}

export interface IAccount {
  address?: string
  loggedIn?: boolean
  locale?: string
  defaultNftIndex?: number
  nfts?: INft[]
}
