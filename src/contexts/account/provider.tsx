import AccountContext from './context'
import { FC, ReactNode, useContext, useEffect, useState } from 'react'
import { useIndexedDBContext } from '@/contexts/indexed-db/provider'
import { useAccount, useNetwork } from 'wagmi'
import { appConfig } from '@/config'

export const useAccountContext = () => useContext(AccountContext)

interface IAccountProviderProps {
  children: ReactNode
}

const AccountProvider: FC<IAccountProviderProps> = ({ children }) => {
  const { indexedDB } = useIndexedDBContext()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [account, setAccount] = useState({
    address: null,
    loggedIn: false,
    locale: appConfig.locale,
    defaultNftIndex: 0,
    contractAddress: null,
    chainAddress: null,
    symbol: null,
    nfts: []
  })

  useEffect(() => {
    ;(async () => {
      setAccount((await indexedDB.get(chain.id + '_' + address)) as any)
    })()
  }, [])

  return <AccountContext.Provider value={{ account, setAccount }}>{children}</AccountContext.Provider>
}

export default AccountProvider
