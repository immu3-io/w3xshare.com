import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'
import { Mail, sepolia, polygonMumbai } from '@4thtech-sdk/ethereum'
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
const immu3Testnet: Chain = {
  id: 3100,
  name: 'Immu3 EVM TestNet',
  network: 'Immu3 EVM TestNet',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://fraa-dancebox-3043-rpc.a.dancebox.tanssi.network/`,
  contracts: {
    appFeeManager: {
      address: '0xE459E555f0CCd996F03A601158eEAe6deC4633bC'
    },
    mail: {
      address: '0xa6199D54df4c904976DC1741eE75A9570c7A3308'
    },
    user: {
      address: '0x5aCeed5372E91C1EB2C09E0F5C46B29A282b2C2D'
    }
  }
}

const getChainConfig = (chainId: number): MailReadyChain => {
  switch (chainId) {
    case 80001:
      return polygonMumbai as MailReadyChain
    case 10243:
      return artheraTestnet as MailReadyChain
    case 3100:
      return immu3Testnet as MailReadyChain
    default:
      return sepolia as MailReadyChain
  }
}

export const initMail = async (secretKey: string, url: string, token: string, chainId: number): Promise<void | IError> => {
  try {
    await aes.importSecretKey(secretKey)
    const remoteStorageProvider = new PollinationX(url, token)

    const encryptionHandler = new EncryptionHandler({
      customEncryptionImplementations: new Map([[aes.getType() as EncryptionType, aes]])
    })
    mail = new Mail({
      signer,
      chain: getChainConfig(chainId),
      remoteStorageProvider,
      encryptionHandler
    })
  } catch (error) {
    return { error }
  }
}
