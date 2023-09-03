import { Network, Alchemy } from 'alchemy-sdk'

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY_SEPOLIA,
  network: Network.ETH_SEPOLIA
}

const alchemy = new Alchemy(settings)

export const getNftMetadata = async (tokenId: number, contractAddress: string): Promise<any> => {
  try {
    return await alchemy.nft.getNftMetadata(contractAddress, tokenId, { refreshCache: true })
  } catch (error) {
    return { error }
  }
}
