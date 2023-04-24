import { NetworkType } from '@4thtech-sdk/types'
import { IReceivedFileOptions } from './interface/index.interface'

export const networkOptions = {
  network: {
    type: NetworkType.TEST_NET,
    endpoint: 'wss://eth-goerli.g.alchemy.com/v2/1dElcULFyNAXaEQo5jxRtq3UfCWcfzgT',
    etherscan: 'https://goerli.etherscan.io/tx/'
  }
}

export const pollinationXConfig = {
  url: process.env.POLLINATIONX_URL,
  token: process.env.POLLINATIONX_TOKEN,
}

export const receivedFileOptions: IReceivedFileOptions = {
  numOfFilesDisplayed: 10
}
