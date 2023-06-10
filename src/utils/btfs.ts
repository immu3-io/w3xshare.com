import { IGetContentByCid, IGetNft } from '@/types'
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
export const getContentByCid = async (cid: string, token: string): Promise<IGetContentByCid> => {
  try {
    const content = await httpClient.post('/api/v1/cat', null, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        arg: cid
      },
      responseType: 'arraybuffer'
    })
    return { content: new TextDecoder('utf-8').decode(content.data) }
  } catch (error) {
    return { error }
  }
}
