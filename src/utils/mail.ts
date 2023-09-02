import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'
import { Mail, sepolia } from '@4thtech-sdk/ethereum'
import { PollinationX } from '@4thtech-sdk/storage'
import { MailReadyChain, EncryptionType } from '@4thtech-sdk/types'
import { IError } from '@/types'
import { fetchSigner, Signer } from '@wagmi/core'

export const aes = new AesEncryption()
export let signer: Signer
export let mail: Mail

export const setSigner = async (): Promise<void> => {
  signer = await fetchSigner()
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
