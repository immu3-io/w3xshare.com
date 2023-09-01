import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'
import { Mail } from '@4thtech-sdk/ethereum'
import { PollinationX } from '@4thtech-sdk/storage'
import { MailReadyChain, NetworkType, Chain } from '@4thtech-sdk/types'
import { IError } from '@/types'
import { fetchSigner, Signer } from '@wagmi/core'
import { sepolia } from 'wagmi/chains'

export const aes = new AesEncryption()
export let signer: Signer
export let mail: Mail

const polygonMumbai: Chain = {
  id: 80001,
  name: 'Polygon Mumbai',
  network: 'maticmum',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  contracts: {
    appFeeManager: {
      address: '0x4b668B2D21d1a245b9cE9190cBCDc52611d31aE6'
    },
    mail: {
      address: '0x239bC91c0F4A0F6825C62dF5238Abb4ab1F3F62f'
    },
    user: {
      address: '0x32a1B8e5EC0a52A94D2E02a86Cfe22d36e536C22'
    }
  }
}

export const setSigner = async (): Promise<void> => {
  signer = await fetchSigner()
}

export const initMail = async (secretKey: string, url: string, token: string): Promise<void | IError> => {
  try {
    await aes.importSecretKey(secretKey)
    const remoteStorageProvider = new PollinationX(url, token)
    const encryptionHandler = new EncryptionHandler({
      defaultEncryption: aes
    })
    mail = new Mail({
      signer,
      chain: sepolia as MailReadyChain,
      remoteStorageProvider,
      encryptionHandler
    })
  } catch (error) {
    return { error }
  }
}
