import { ethers } from 'ethers'

export const delay = (ms: number) => new Promise(r => setTimeout(r, ms))
export const truncateAddress = (address: string, length: number = 5): string => (address ? `${address.slice(0, length)}...${address.slice(-length)}` : '')
export const isAddress = (address: string): boolean => (address ? ethers.utils.isAddress(address) : false)
export const getWei = (value: any, decimals: number = 18): string => (value ? ethers.utils.parseUnits(value.toString(), decimals).toString() : '0')
export const getNumbersFromString = (value: string): string => value.match(/\d+/)[0]
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}
