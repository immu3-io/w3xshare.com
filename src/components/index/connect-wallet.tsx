import useTranslation from 'next-translate/useTranslation'
import ReceivedFilesModal from '@/ui/modals/received-files.modal'
import { FC, useEffect, useState } from 'react'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useNetwork, useConnect } from 'wagmi'
import { useIndexedDBContext } from '@/contexts/indexed-db/provider'
import { useAccountContext } from '@/contexts/account/provider'
import { getNfts } from '@/utils/btfs'
import { setSigner } from '@/utils/mail'
import { useRouter } from 'next/router'
import { appConfig } from '@/config'
interface IConnectWalletProps {
  show: boolean
  onClose: any
}

const ConnectWallet: FC<IConnectWalletProps> = ({ show, onClose }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { open, setDefaultChain } = useWeb3Modal()
  const { isConnected, address } = useAccount()
  const { indexedDB } = useIndexedDBContext()
  const { account } = useAccountContext()
  const { chain } = useNetwork()
  const [agreeState, setAgreeState] = useState<boolean>(false)
  const [showReceivedFiles, setShowReceivedFiles] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [secretKey, setSecretKey] = useState<string>('')

  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const handleConnectedAccount = async (): Promise<void> => {
    if (isConnected) {
      if (agreeState) {
        setAgreeState(false)
        const currentAccount = await indexedDB.get(chain.id + '_' + address)
        if (!currentAccount) {
          account.address = address
          account.locale = appConfig.locale
          account.defaultNftIndex = 0
          account.contractAddress = null
          account.chainAddress = chain.id + '_' + address
          account.symbol = null
        } else {
          account.address = currentAccount.address
          account.locale = currentAccount.locale
          account.defaultNftIndex = currentAccount.defaultNftIndex
          account.contractAddress = currentAccount.contractAddress
          account.chainAddress = chain.id + '_' + currentAccount.address
          account.symbol = currentAccount.symbol
          account.nfts = currentAccount.nfts
        }
        const nftsRes = await getNfts(address)
        if (!nftsRes?.error) {
          account.nfts = nftsRes.nfts
          account.contractAddress = nftsRes.contractAddress
          account.symbol = nftsRes.symbol
          await indexedDB.put(account)
          await setSigner()
          _handleUrlParams()
        }
      }
    } else await open()
  }
  const _handleUrlParams = (): void => {
    const { tx, s } = router.query
    if (tx) {
      setTxHash(tx as string)
      setSecretKey((s as string) || undefined)
      setShowReceivedFiles(true)
    } else onClose(true)
  }

  useEffect(() => {
    !isConnected || !indexedDB || handleConnectedAccount()
  }, [isConnected, indexedDB])

  useEffect(() => {
    if (!show) {
      setAgreeState(false) // Reset the agreeState when the modal is closed
    }
  }, [show])

  if (!show) return <></>

  return (
    <>
      <div className='fixed inset-0 bg-neutral-600 bg-opacity-70 overflow-y-auto h-full w-full' id='my-modal-overlay'></div>
      <div id='crypto-modal' className='fixed z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)]'>
        <div className='relative w-full h-full max-w-md md:h-auto'>
          <div className='relative bg-white rounded-lg shadow dark:bg-neutral-700'>
            <button
              type='button'
              onClick={() => onClose(false)}
              className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-neutral-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-neutral-800 dark:hover:text-white'
              data-modal-hide='crypto-modal'
            >
              <svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                ></path>
              </svg>
              <span className='sr-only'>{t('close')}</span>
            </button>
            <div className='px-6 py-4 border-b rounded-t dark:border-gray-600'>
              <h3 className='text-base font-semibold text-gray-900 lg:text-xl dark:text-white'>{t('connectWallet')}</h3>
            </div>
            <div className='p-6'>
              <p>
                <input
                  onChange={() => setAgreeState(!agreeState)}
                  id='agree-checkbox'
                  type='checkbox'
                  value=''
                  className='w-4 h-4 text-pollinationx-honey bg-neutral-100 border-gray-400 rounded ring-offset-0 dark:focus:ring-0 dark:ring-offset-0 focus:ring-0 dark:bg-neutral-700 dark:border-gray-400'
                />
                <label htmlFor='agree-checkbox' className='text-sm font-normal text-gray-500 dark:text-gray-400 ml-2'>
                  {t('iAgreeTo')}{' '}
                  <a
                    className='text-pollinationx-honey'
                    target='_blank'
                    href='https://github.com/immu3-io/static-assets/raw/main/pdf/2023-02-20_CR_Systems_Privacy_Policy.pdf'
                  >
                    {' '}
                    {t('privacyPolicy')}{' '}
                  </a>
                  {t('and')}{' '}
                  <a
                    className='text-pollinationx-honey'
                    target='_blank'
                    href='https://github.com/immu3-io/static-assets/raw/main/pdf/2023-03-13_CR_Systems_dMail_dChat_w3xshare_Software_Terms.pdf'
                  >
                    {t('softwareTerms')}
                  </a>
                </label>
              </p>
              <ul className='my-4 space-y-3'>
                {connectors
                  .slice()
                  .reverse()
                  .map(connector =>
                    connector.id == 'walletConnect' ? (
                      <li key={connector.id}>
                        <button
                          disabled={!connector.ready || !agreeState}
                          key={connector.id}
                          onClick={handleConnectedAccount}
                          className='disabled:opacity-25 disabled:pointer-events-none w-full text-left flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-neutral-50 hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:text-white'
                        >
                          <img className='h-5' src={`/img/wallets/${connector.id}.svg`} />
                          <span className='flex-1 ml-3 whitespace-nowrap'>
                            {connector.name}
                            {!connector.ready && ` (${t('unsupported')})`}
                            {isLoading && connector.id === pendingConnector?.id && ` (${t('connecting')})`}
                          </span>
                        </button>
                      </li>
                    ) : (
                      <li key={connector.id}>
                        <button
                          disabled={!connector.ready || !agreeState}
                          key={connector.id}
                          onClick={!isConnected ? () => connect({ connector }) : handleConnectedAccount}
                          className='disabled:opacity-25 disabled:pointer-events-none w-full text-left flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-neutral-50 hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:text-white'
                        >
                          <img className='h-5' src={`/img/wallets/${connector.id}.svg`} />
                          <span className='flex-1 ml-3 whitespace-nowrap'>
                            {connector.name}
                            {!connector.ready && ` (${t('unsupported')})`}
                            {isLoading && connector.id === pendingConnector?.id && ` (${t('connecting')})`}
                          </span>
                        </button>
                      </li>
                    )
                  )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ReceivedFilesModal show={showReceivedFiles} onClose={onClose} txHash={txHash} secretKey={secretKey} />
    </>
  )
}

export default ConnectWallet
