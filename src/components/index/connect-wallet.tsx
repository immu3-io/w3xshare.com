import useTranslation from 'next-translate/useTranslation'
import ReceivedFilesModal from '@/ui/modals/received-files.modal'
import { FC, useEffect, useState } from 'react'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useNetwork } from 'wagmi'
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
  const { open } = useWeb3Modal()
  const { isConnected, address } = useAccount()
  const { indexedDB } = useIndexedDBContext()
  const { account } = useAccountContext()
  const { chain } = useNetwork()
  const [agreeState, setAgreeState] = useState<boolean>(false)
  const [showReceivedFiles, setShowReceivedFiles] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [secretKey, setSecretKey] = useState<string>('')

  const handleConnectedAccount = async (): Promise<void> => {
    console.log('chain')
    console.log(chain.blockExplorers.default.url)
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
                <li>
                  <button
                    disabled={!agreeState}
                    className='disabled:opacity-25 disabled:pointer-events-none w-full text-left flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-neutral-50 hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:text-white'
                  >
                    <svg
                      aria-hidden='true'
                      className='h-5'
                      viewBox='0 0 512 512'
                      version='1.1'
                      xmlns='http://www.w3.org/2000/svg'
                      xmlnsXlink='http://www.w3.org/1999/xlink'
                    >
                      <defs>
                        <radialGradient cx='0%' cy='50%' fx='0%' fy='50%' r='100%' id='radialGradient-1'>
                          <stop stopColor='#5D9DF6' offset='0%'></stop>
                          <stop stopColor='#006FFF' offset='100%'></stop>
                        </radialGradient>
                      </defs>
                      <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                        <g id='logo'>
                          <rect id='base' fill='url(#radialGradient-1)' x='0' y='0' width='512' height='512' rx='256'></rect>
                          <path
                            d='M169.209772,184.531136 C217.142772,137.600733 294.857519,137.600733 342.790517,184.531136 L348.559331,190.179285 C350.955981,192.525805 350.955981,196.330266 348.559331,198.676787 L328.82537,217.99798 C327.627045,219.171241 325.684176,219.171241 324.485851,217.99798 L316.547278,210.225455 C283.10802,177.485633 228.89227,177.485633 195.453011,210.225455 L186.951456,218.549188 C185.75313,219.722448 183.810261,219.722448 182.611937,218.549188 L162.877976,199.227995 C160.481326,196.881474 160.481326,193.077013 162.877976,190.730493 L169.209772,184.531136 Z M383.602212,224.489406 L401.165475,241.685365 C403.562113,244.031874 403.562127,247.836312 401.165506,250.182837 L321.971538,327.721548 C319.574905,330.068086 315.689168,330.068112 313.292501,327.721609 C313.292491,327.721599 313.29248,327.721588 313.29247,327.721578 L257.08541,272.690097 C256.486248,272.103467 255.514813,272.103467 254.915651,272.690097 C254.915647,272.690101 254.915644,272.690105 254.91564,272.690108 L198.709777,327.721548 C196.313151,330.068092 192.427413,330.068131 190.030739,327.721634 C190.030725,327.72162 190.03071,327.721606 190.030695,327.721591 L110.834524,250.181849 C108.437875,247.835329 108.437875,244.030868 110.834524,241.684348 L128.397819,224.488418 C130.794468,222.141898 134.680206,222.141898 137.076856,224.488418 L193.284734,279.520668 C193.883897,280.107298 194.85533,280.107298 195.454493,279.520668 C195.454502,279.520659 195.45451,279.520651 195.454519,279.520644 L251.65958,224.488418 C254.056175,222.141844 257.941913,222.141756 260.338618,224.488222 C260.338651,224.488255 260.338684,224.488288 260.338717,224.488321 L316.546521,279.520644 C317.145683,280.107273 318.117118,280.107273 318.71628,279.520644 L374.923175,224.489406 C377.319825,222.142885 381.205562,222.142885 383.602212,224.489406 Z'
                            id='WalletConnect'
                            fill='#FFFFFF'
                            fillRule='nonzero'
                          ></path>
                        </g>
                      </g>
                    </svg>
                    <span onClick={handleConnectedAccount} className='flex-1 ml-3 whitespace-nowrap'>
                      {t('walletConnect')}
                    </span>
                  </button>
                </li>
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
