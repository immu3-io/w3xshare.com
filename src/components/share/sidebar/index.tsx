import useTranslation from 'next-translate/useTranslation'
import BottomMenu from '@/components/share/sidebar/menu-bottom'
import BuyNftModal from '@/ui/modals/buy-nft.modal'
import FreeMint from '@/components/share/sidebar/free-mint'
import { FC, useEffect, useState } from 'react'
import { INft } from '@/types'
import { HiHome, HiRefresh } from 'react-icons/hi'
import { Web3Button } from '@web3modal/react'
import { useAccountContext } from '@/contexts/account/provider'
import { useIndexedDBContext } from '@/contexts/indexed-db/provider'
import { useAccount } from 'wagmi'
import { getNumbersFromString } from '@/utils/helper'
import { getNfts } from '@/utils/btfs'
import { getNftMetadata } from '@/utils/alchemy'
import { Dropdown, Spinner, Tooltip } from 'flowbite-react'
import * as _ from 'lodash'

interface ISidebarProps {
  nfts?: INft[]
}

const Sidebar: FC<ISidebarProps> = ({ nfts }) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { account, setAccount } = useAccountContext()
  const { indexedDB } = useIndexedDBContext()
  const [showBuyNftModal, setShowBuyNftModal] = useState<boolean>(false)
  const [selectedNftIndex, setSelectedNftIndex] = useState<number>(0)
  const [nftSize, setNftSize] = useState<number>(0)
  const [refreshMetadataProgress, setRefreshMetadataProgress] = useState<boolean>(false)

  const handleSelectedNftOnClick = async (index: number): Promise<void> => {
    setSelectedNftIndex(index)
    account.defaultNftIndex = index !== undefined ? index : selectedNftIndex
    await indexedDB.put(account)
    setAccount(_.cloneDeep(account))
  }

  const handleGetNfts = async (closeBuyNftModal?: boolean, syncNfts?: boolean): Promise<void> => {
    !closeBuyNftModal || setShowBuyNftModal(false)
    if (syncNfts) {
      const nftsRes = await getNfts(address)
      if (!nftsRes?.error) {
        account.nfts = nftsRes.nfts
        const nftMetadataRes = await getNftMetadata(Number(account.nfts[account.defaultNftIndex].id.tokenId))
        if (!nftMetadataRes?.error) {
          account.nfts[account.defaultNftIndex].media = nftMetadataRes.media
          account.nfts[account.defaultNftIndex].metadata.attributes = nftMetadataRes.rawMetadata.attributes
          account.nfts[account.defaultNftIndex].timeLastUpdated = nftMetadataRes.timeLastUpdated
        }
        await indexedDB.put(account)
        setAccount(_.cloneDeep(account))
      }
    }
  }

  const handleRefreshNftMetadataOnClick = async (): Promise<void> => {
    setRefreshMetadataProgress(true)
    const nftMetadataRes = await getNftMetadata(Number(account.nfts[account.defaultNftIndex].id.tokenId))
    if (!nftMetadataRes?.error) {
      account.nfts[account.defaultNftIndex].media = nftMetadataRes.media
      account.nfts[account.defaultNftIndex].metadata.attributes = nftMetadataRes.rawMetadata.attributes
      account.nfts[account.defaultNftIndex].timeLastUpdated = nftMetadataRes.timeLastUpdated
      await indexedDB.put(account)
      setAccount(_.cloneDeep(account))
    }
    setRefreshMetadataProgress(false)
  }

  const _handleGetNftSizes = (): void => {
    setSelectedNftIndex(account.defaultNftIndex)
    !account.nfts[account.defaultNftIndex].metadata.attributes[1].value.toString().includes('GB') ||
      setNftSize(Number(getNumbersFromString(account.nfts[account.defaultNftIndex].metadata.attributes[1].value.toString())))
  }

  useEffect(() => {
    !account.address || !nfts.length || _handleGetNftSizes()
  }, [account.address])

  return (
    <>
      <nav className='fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-neutral-800 border-0 px-4 lg:px-6 py-2.5'>
        <div className='px-3 lg:px-5 lg:pl-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start'>
              <button
                data-drawer-target='logo-sidebar'
                data-drawer-toggle='logo-sidebar'
                aria-controls='logo-sidebar'
                type='button'
                className='inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-neutral-700 dark:focus:ring-gray-600'
              >
                <span className='sr-only'>{t('openSidebar')}</span>
                <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    clipRule='evenodd'
                    fillRule='evenodd'
                    d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
                  ></path>
                </svg>
              </button>
              <a href='/' className='flex ml-2 md:mr-24'>
                <img className='h-12 mr-3 block dark:hidden' src='/img/w3xshare_logo_white_landscape.svg' alt='W3XShare Logo' />
                <img className='h-12 mr-3 hidden dark:block' src='/img/w3xshare_logo_white_landscape.svg' alt='W3XShare Logo' />
              </a>
            </div>
            <div className='flex items-center'>
              {account?.nfts?.length > 0 && (
                <div className='mr-3'>
                  <Dropdown className='w-1/2 dark:bg-neutral-700' label={t('account') + ': ' + account.nfts[account.defaultNftIndex].title}>
                    <Dropdown.Header>
                      <span className='block text-sm '>
                        {account.nfts[account.defaultNftIndex].title} ({t('size')} {account.nfts[account.defaultNftIndex].metadata.attributes[1].value},{' '}
                        {t('usage')} {account.nfts[account.defaultNftIndex].metadata.attributes[0].value}%){' '}
                      </span>{' '}
                      {account.nfts?.length > 1 && <span className='text-pollinationx-honey block truncate text-sm font-medium'>{t('selected')}</span>}
                    </Dropdown.Header>
                    {account.nfts.map(
                      (nft: INft, index: number) =>
                        index !== account.defaultNftIndex && (
                          <Dropdown.Item key={nft.id.tokenId} onClick={() => handleSelectedNftOnClick(index)}>
                            {nft.title} ({t('size')} {nft.metadata.attributes[1].value}, {t('usage')} {nft.metadata.attributes[0].value}%){' '}
                          </Dropdown.Item>
                        )
                    )}
                  </Dropdown>
                </div>
              )}
              <Web3Button />
            </div>
          </div>
        </div>
      </nav>
      <aside
        id='logo-sidebar'
        className='fixed top-0 left-0 z-40 w-64 h-screen pt-24 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-neutral-800 dark:border-gray-700'
        aria-label='Sidebar'
      >
        <div className='h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gradient-to-b from-neutral-800 to-pollinationx-purple'>
          <ul className='space-y-2 font-medium'>
            <li>
              <a href='#' className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700'>
                <HiHome className='text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white' />
                <span className='ml-3'>{t('home')}</span>
              </a>
            </li>
          </ul>
        </div>
        <div className='absolute bottom-0 left-0 justify-center p-4 w-full z-20'>
          <div className='flex items-center justify-center'>
            <div className='relative bg-neutral-800 p-3 shadow-xl'>
              {account.nfts?.length > 0 ? (
                <div>
                  <div className='absolute right-4 mt-1'>
                    <Tooltip
                      content={t('refreshMetadata')}
                      animation='duration-300'
                      placement='left'
                      arrow={false}
                      className='mt-3 bg-gradient-to-br from-pollinationx-purple to-gray-700 dark:bg-gradient-to-br opacity-90'
                    >
                      <HiRefresh
                        onClick={handleRefreshNftMetadataOnClick}
                        className={`text-2xl ml-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white float-right cursor-pointer 
                        ${refreshMetadataProgress ? 'animate-spin' : ''}`}
                      />
                    </Tooltip>
                  </div>

                  <img src={account.nfts[account.defaultNftIndex]?.media[0]?.raw} className='w-full object-cover object-center' alt='' />
                  <h2 className='text-md font-bold text-pollinationx-honey mt-3'>{account.nfts[account.defaultNftIndex]?.title}</h2>
                </div>
              ) : (
                account?.nfts === null && <div className='justify-center text-center mb-5'>{<Spinner />}</div>
              )}
              <p className='text-gray-400 text-xs mb-2'>{account?.nfts?.length > 0 ? account.nfts[account.defaultNftIndex]?.description : t('noNftsInfo')}</p>
              <p className='bg-neutral-600 h-[0.5px] w-full my-2'></p>
              <div className='flex items-center'>
                <img src='/img/favicon.png' alt='PollinationX' className='h-8 w-8 rounded-full mr-2' />
                <p className='text-gray-400 text-[12px]'>
                  {t('createdBy')}{' '}
                  <a href='https://pollinationx.io' target='_black' rel='no-opener' className='text-white font-bold'>
                    PollinationX
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className='mb-5 mt-7 pt-1 pb-1 text-center'>
            {account?.nfts?.length > 0 && (
              <button
                onClick={() => setShowBuyNftModal(true)}
                type='button'
                className='cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 mr-2
                                                    overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br
                                                    from-pollinationx-honey to-pollinationx-purple group-hover:from-pollinationx-honey group-hover:to-pollinationx-purple
                                                    hover:text-white dark:text-white focus:outline-none focus:ring-0
                                                    dark:focus:ring-blue-800'
              >
                <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-neutral-900 rounded-md group-hover:bg-opacity-0'>
                  {t('upgradeStorage')}
                </span>
              </button>
            )}
            {account?.nfts?.length === 0 && <FreeMint onClose={handleGetNfts} />}
          </div>
          <BottomMenu />
        </div>
      </aside>
      <BuyNftModal
        show={showBuyNftModal}
        onClose={handleGetNfts}
        tokenId={_.get(account?.nfts, `[${account.defaultNftIndex}].id.tokenId`, '')}
        nftSize={nftSize}
      />
    </>
  )
}

export default Sidebar
