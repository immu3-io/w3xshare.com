import { IGetNft } from '@/types'
import { doSignMessage } from '@/utils/contract'
import { pollinationXConfig } from '@/config'
import { httpClient } from '@/utils/client'

export const getNfts = async (address: string): Promise<IGetNft> => {
  try {
    const { chain, nonce, signature } = await doSignMessage(pollinationXConfig.newNft.message)
    return (
      await httpClient.get('/auth/login', {
        params: {
          wallet: address,
          chain,
          nonce,
          signature
        }
      })
    ).data
  } catch (error) {
    return { error }
  }
}
