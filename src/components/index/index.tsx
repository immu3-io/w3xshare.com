import ConnectWallet from '@/components/index/connect-wallet'
import useTranslation from 'next-translate/useTranslation'
import { FC, useState } from 'react'
import { useAccountContext } from '@/contexts/account/provider'
import { useRouter } from 'next/router'

const Index: FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { push } = useRouter()
  const { account } = useAccountContext()
  const [showConnectWallet, setShowConnectWallet] = useState<boolean>(false)

  const handleRedirect = async (redirect: boolean): Promise<void> => {
    setShowConnectWallet(false)
    if (redirect) {
      account.loggedIn = true
      await push(
        {
          pathname: `/share`
        },
        null,
        { locale: account.locale !== router.defaultLocale ? account.locale : false }
      )
    }
  }

  return (
    <>
      <nav className='fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-neutral-800 border-0 px-4 lg:px-6 py-2.5'>
        <div className='px-3 lg:px-5 lg:pl-0 text-center text-gray-700 dark:text-white text-sm'>
          W3XShare Beta is currently deployed on Sepolia Testnet for testing purposes, therefore technical disruptions may occur.
        </div>
      </nav>
      <section className='gradient-form bg-neutral-200 dark:bg-neutral-700 flex h-screen'>
        <div className='container h-full p-10 m-auto'>
          <div className='g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200'>
            <div className='w-full'>
              <div className='block rounded-lg bg-white shadow-lg dark:bg-neutral-800'>
                <div className='g-0 lg:flex lg:flex-wrap'>
                  <div className='px-4 md:px-0 lg:w-6/12'>
                    <div className='md:mx-6 md:p-12'>
                      <div className='text-center'>
                        <img className='mx-auto w-80 block dark:hidden' src='/img/w3xshare_logo_white_landscape.svg' alt='W3XShare Logo' />
                        <img className='mx-auto w-80 hidden dark:block' src='/img/w3xshare_logo_white_landscape.svg' alt='W3XShare Logo' />
                      </div>
                      <form>
                        <ul className='max-w-md space-y-2 text-gray-500 list-inside dark:text-gray-400 text-sm pt-14 pb-6'>
                          <li className='flex items-center'>
                            <svg
                              className='w-4 h-4 mr-1.5 text-pollinationx-honey flex-shrink-0'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              ></path>
                            </svg>
                            {t('permissionlessDecentralizedStorageAccess')}
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='w-4 h-4 mr-1.5 text-pollinationx-honey flex-shrink-0'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              ></path>
                            </svg>
                            {t('nftAuthorization1')}
                            <a className='ml-1 mr-1' href='https://pollinationx.io' target='_blank'>
                              <u>PollinationX</u>
                            </a>
                            {t('nftAuthorization2')}
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='w-4 h-4 mr-1.5 text-pollinationx-honey flex-shrink-0'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              ></path>
                            </svg>
                            {t('multiChainSupport')}
                          </li>
                          <li className='flex items-center'>
                            <svg
                              className='w-4 h-4 mr-1.5 text-pollinationx-honey flex-shrink-0'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              ></path>
                            </svg>
                            <a target='_blank' href='https://wiki.pollinationx.io/overview/px-storage-nfts/protocol-audit'>
                              <u>{t('auditedSmartContract')}</u>
                            </a>
                          </li>
                        </ul>
                        <div className='mb-12 pt-1 pb-1 text-center'>
                          <button
                            type='button'
                            onClick={() => setShowConnectWallet(true)}
                            className='relative inline-flex items-center justify-center p-0.5 mb-2 mr-2
                                                    overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br
                                                    from-pollinationx-honey to-pollinationx-purple group-hover:from-pollinationx-honey group-hover:to-pollinationx-purple
                                                    hover:text-white dark:text-white focus:outline-none focus:ring-0
                                                    dark:focus:ring-blue-800'
                          >
                            <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-neutral-900 rounded-md group-hover:bg-opacity-0'>
                              {t('connectWallet')}
                            </span>
                          </button>
                        </div>
                        <div className='flex items-center justify-between pb-6'>
                          <div className='flex justify-center space-x-2 text-neutral-700 dark:text-neutral-300'>
                            <a target='_blank' href='https://twitter.com/w3xshare'>
                              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                              </svg>
                            </a>
                            <a target='_blank' href='https://github.com/immu3-io/w3xshare.com/'>
                              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                              </svg>
                            </a>
                          </div>
                          <a
                            target='_blank'
                            href='http://wiki.w3xshare.com/'
                            className='hover:text-pollinationx-honey inline-block px-6 pt-1 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out focus:outline-none focus:ring-0'
                          >
                            {t('readMore')} <span aria-hidden='true'>→</span>
                          </a>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div
                    className='flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none'
                    style={{ background: 'linear-gradient(to right, #222222, #286FA4' }}
                  >
                    <div className='px-4 py-6 text-white md:mx-6 md:p-12'>
                      <h4 className='mb-6 text-xl font-semibold'>{t('decentralizedDrive')}</h4>
                      <p className='text-sm'>{t('decentralizedDriveText')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ConnectWallet show={showConnectWallet} onClose={handleRedirect} />
    </>
  )
}

export default Index
