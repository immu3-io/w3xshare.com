import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'
import { Mail, sepolia } from '@4thtech-sdk/ethereum'
import { PollinationX } from '@4thtech-sdk/storage'
import { MailReadyChain, EncryptionType, NetworkType, Chain } from '@4thtech-sdk/types'
import { IError } from '@/types'
import { fetchSigner, Signer } from '@wagmi/core'

export const aes = new AesEncryption()
export let signer: Signer
export let mail: Mail

export const setSigner = async (): Promise<void> => {
  signer = await fetchSigner()
}
const artheraTestnet: Chain = {
  id: 10243,
  name: 'Arthera Testnet',
  network: 'Arthera Testnet',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://rpc-test.arthera.net/`,
  contracts: {
    appFeeManager: {
      address: '0x628DAACcC211cE0A639e6EAd89B1c63b57d633d4'
    },
    mail: {
      address: '0x00e75F6f934e1Fb2Bd881682F33dDFA814Ef1d2b'
    },
    user: {
      address: '0x55755C910fAC95cf9c8265Af6a971fA3746029BA'
    }
  }
}

export const initMail = async (secretKey: string, url: string, token: string): Promise<void | IError> => {
  try {
    await aes.importSecretKey(secretKey)
    const remoteStorageProvider = new PollinationX(url, token)

    const encryptionHandler = new EncryptionHandler({
      customEncryptionImplementations: new Map([[aes.getType() as EncryptionType, aes]])
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
