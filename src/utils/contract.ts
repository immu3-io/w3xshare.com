import abiPX from '@/abi/PX.json'
import { IDoWriteContract, ISignAuth } from '@/types'
import { Address } from 'wagmi'
import { prepareWriteContract, readContract, writeContract, signMessage } from '@wagmi/core'

export const doSignMessage = async (message: string): Promise<ISignAuth> => ({
  chain: await window.ethereum.request({ method: 'eth_chainId' }),
  nonce: message,
  signature: await signMessage({
    message: message
  })
})
export const doWriteContract = async (functionName: string, args: any[], overrides?: any, address?: string, abi?: any[]): Promise<IDoWriteContract> => {
  try {
    const config = await prepareWriteContract({
      address: address as Address,
      abi: abi || abiPX,
      functionName,
      args: [...args],
      overrides
    })

    return await writeContract(config)
  } catch (error) {
    return { error }
  }
}
export const doReadContract = async (functionName: string, args: any[], address?: string, abi?: any[]): Promise<any> => {
  try {
    return await readContract({
      address: address as Address,
      abi: abi || abiPX,
      functionName,
      args: [...args]
    })
  } catch (error) {
    return { error }
  }
}
