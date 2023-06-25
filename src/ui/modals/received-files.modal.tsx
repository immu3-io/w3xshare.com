import useTranslation from 'next-translate/useTranslation'
import React, { FC, useRef, useState } from 'react'
import { Label, Modal, Textarea } from 'flowbite-react'
import { initMail, mail } from '@/utils/mail'
import { useAccountContext } from '@/contexts/account/provider'
import { ReceivedEnvelope } from '@4thtech-sdk/types/src/lib/mail.types'
import { Mail, sepolia } from '@4thtech-sdk/ethereum'
import { MailReadyChain } from '@4thtech-sdk/types'
import { receivedFilesOptions } from '@/config'
import { BeatLoader } from 'react-spinners'
import { delay } from '@/utils/helper'
import ReceivedFilesCollapse from '@/ui/surfaces/received-files-collapse.surface';

interface IReceivedFilesModalProps {
  show: boolean
  onClose: any
  txHash: string
  secretKey?: string
}

const ReceivedFilesModal: FC<IReceivedFilesModalProps> = ({ show, onClose, txHash, secretKey }) => {
  const { t } = useTranslation()
  const { account } = useAccountContext()
  const [receivedEnvelope, setReceivedEnvelope] = useState<ReceivedEnvelope>(null)
  const [fetching, setFetching] = useState<boolean>(true)
  const [fetchingText, setFetchingText] = useState<string>('fetchingFiles')
  const [numOfEnvelopes, setNumOfEnvelopes] = useState<number>(receivedFilesOptions.numOfFilesDisplayed)
  const [showAllToggle, setShowAllToggle] = useState<boolean>(false)
  const [isExpanded] = useState<boolean>(true)
  const [showSecretKeyInput, setShowSecretKeyInput] = useState<boolean>(true)
  const formRef = useRef(null)

  const handleFetchFilesOnClick = async (event): Promise<void> => {
    event.preventDefault()

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    setShowSecretKeyInput(false)

    try {
      // await initMail(secretKey, account.nfts[account.defaultNftIndex].endpoint, account.nfts[account.defaultNftIndex].jwt)
      console.log('FETCHING FILES')
      // console.log(mail, 'MAIL')
      // console.log('MAIL PROVIDER')
      // console.log(mail.provider)
      // const receivedEnvelope = await mail.fetchByTransactionHash(txHash)
      // console.log(receivedEnvelope, 'ENVELOPES')
      // setFetching(false)
      // setFetchingText('No files')
      // setEnvelopes([receivedEnvelope])
      await delay(4000)
      // setFetching(false)
      // setFetchingText('noFiles')
      setReceivedEnvelope(receivedEnvelope)
    } catch (error) {
      console.log(error.message, 'handleFetchFilesOnClick ERROR')
    }
  }

  return (
    <>
      <Modal show={show} position='center' onClose={() => onClose(false)}>
        <Modal.Header className='dark:bg-neutral-800 dark:border-gray-700 modalHeader'>{t('receivedFiles')}</Modal.Header>
        <Modal.Body className='dark:bg-neutral-800'>
          <div className='space-y-6 p-3 overflow-x-scroll '>
            {receivedEnvelope ? (
              <div>
                <ReceivedFilesCollapse receivedEnvelope={receivedEnvelope} />
              </div>
            ) : (
              <div>
                {showSecretKeyInput ? (
                  <form ref={formRef}>
                    <div>
                      <div className='w-full'>
                        <div className='mb-2'>
                          <Label htmlFor='secretKey' value={t('secretKey')} />
                        </div>
                        <Textarea id='secretKey' name='secretKey' defaultValue={secretKey} rows={2} disabled={!!secretKey} required={true} />
                      </div>
                      <div className='w-full font-bold text-center mt-2 text-xs text-red-600'>
                        <label>
                          {t('note')}!
                          <br />
                          {t('receivedFilesSecretKeyNote')}
                        </label>
                      </div>
                    </div>
                    <div className='w-full mt-12 text-center'>
                      <button
                        onClick={handleFetchFilesOnClick}
                        type='button'
                        className={`cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 mr-2
                                                    overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br
                                                    from-pollinationx-honey to-pollinationx-purple group-hover:from-pollinationx-honey group-hover:to-pollinationx-purple
                                                    hover:text-white dark:text-white focus:outline-none focus:ring-0
                                                    dark:focus:ring-blue-800`}
                      >
                        <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-neutral-900 rounded-md group-hover:bg-opacity-0'>
                          {t('fetchFiles')}
                        </span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className='w-full float-left'>
                    <p className='pt-1 text-white float-left'>{t(fetchingText)}</p>
                    <BeatLoader size={5} className='float-left mt-1.5 mr-4' color='white' />
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className='dark:bg-neutral-800 dark:border-0'>
          <div className='w-full text-right'>
            <button
              onClick={() => onClose(true)}
              type='button'
              className={`cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 mr-2
                                                    overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br
                                                    from-pollinationx-honey to-pollinationx-purple group-hover:from-pollinationx-honey group-hover:to-pollinationx-purple
                                                    hover:text-white dark:text-white focus:outline-none focus:ring-0
                                                    dark:focus:ring-blue-800`}
            >
              <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-neutral-900 rounded-md group-hover:bg-opacity-0'>
                {t('dashboard')}
              </span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ReceivedFilesModal
