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
  networkEndpoint: `https://fraa-flashbox-2800-rpc.a.stagenet.tanssi.network/`,
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

const fantomSonicBuildersTestnetChain: Chain = {
  id: 64165,
  name: 'FantomSonicBuildersTestnet',
  network: 'FantomSonicBuildersTestnet',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://rpc.sonic.fantom.network/`,
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
} as const satisfies Chain

const oasisSapphireTestnet: Chain = {
  id: 23295,
  name: 'Oasis Sapphire Testnet',
  network: 'Oasis Sapphire Testnet',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://testnet.sapphire.oasis.dev/`,
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
} as const satisfies Chain

const metisSepoliaTestnet: Chain = {
  id: 59901,
  name: 'Metis Sepolia Testnet',
  network: 'Metis Sepolia Testnet',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://sepolia.rpc.metisdevops.link/`,
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
} as const satisfies Chain

const beresheetEVM: Chain = {
  id: 2022,
  name: 'BeresheetEVM',
  network: 'BeresheetEVM',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://beresheet-evm.jelliedowl.net/`,
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
} as const satisfies Chain

const mantleTestnet: Chain = {
  id: 5003,
  name: 'MantleSepoliaTestnet',
  network: 'MantleSepoliaTestnet',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://rpc.sepolia.mantle.xyz/`,
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
} as const satisfies Chain

const zetachainTestnet: Chain = {
  id: 7001,
  name: 'ZetachainTestnet',
  network: 'ZetachainTestnet',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://zetachain-athens-evm.blockpi.network/v1/rpc/public/`,
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
} as const satisfies Chain

const fantomTestnet: Chain = {
  id: 4002,
  name: 'FantomTestnet',
  network: 'FantomTestnet',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://rpc.testnet.fantom.network/`,
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
} as const satisfies Chain

const gnosisTestnet: Chain = {
  id: 10200,
  name: 'GnosisTestnet',
  network: 'GnosisTestnet',
  type: NetworkType.TEST_NET,
  networkEndpoint: `https://rpc.chiadochain.net/`,
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
} as const satisfies Chain

const getChainConfig = (chainId: number): MailReadyChain => {
  switch (chainId) {
    case 80001:
      return polygonMumbai as MailReadyChain
    case 10243:
      return artheraTestnet as MailReadyChain
    case 3100:
      return immu3Testnet as MailReadyChain
    case 64165:
      return fantomSonicBuildersTestnetChain as MailReadyChain
    case 23295:
      return oasisSapphireTestnet as MailReadyChain
    case 59901:
      return metisSepoliaTestnet as MailReadyChain
    case 2022:
      return beresheetEVM as MailReadyChain
    case 5003:
      return mantleTestnet as MailReadyChain
    case 7001:
      return zetachainTestnet as MailReadyChain
    case 4002:
      return fantomTestnet as MailReadyChain
    case 10200:
      return gnosisTestnet as MailReadyChain
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
