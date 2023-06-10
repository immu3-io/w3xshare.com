import { pollinationXConfig } from '@/config'
import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'
import { Mail, sepolia } from '@4thtech-sdk/ethereum'
import { PollinationX } from '@4thtech-sdk/storage'
import { MailReadyChain } from '@4thtech-sdk/types'
import { fetchSigner, Signer } from '@wagmi/core'

export const aes = new AesEncryption()
export let signer: Signer
export let mail: Mail
const remoteStorageProvider = new PollinationX(pollinationXConfig.url, pollinationXConfig.token)

export const setSigner = async (): Promise<void> => {
  signer = await fetchSigner()
}
export const initMail = async (secretKey: string): Promise<void> => {
  try {
    await aes.importSecretKey(secretKey)
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
    console.log(error.message, 'initMail ERROR')
  }
}
