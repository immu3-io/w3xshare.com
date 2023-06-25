import useTranslation from 'next-translate/useTranslation'
import React, { FC, useRef, useState } from 'react'
import { Label, Modal, Textarea } from 'flowbite-react'
import { initMail, mail } from '@/utils/mail'
import { useAccountContext } from '@/contexts/account/provider'
import { ReceivedEnvelope } from '@4thtech-sdk/types/src/lib/mail.types'
import { Mail, sepolia } from '@4thtech-sdk/ethereum'
import { MailReadyChain } from '@4thtech-sdk/types'
import { BeatLoader } from 'react-spinners'
import { delay } from '@/utils/helper'
import ReceivedFilesCollapse from '@/ui/surfaces/received-files-collapse.surface'

interface IReceivedFilesModalProps {
  show: boolean
  onClose: any
  txHash: string
  secretKey?: string
}

const ReceivedFilesModal: FC<IReceivedFilesModalProps> = ({ show, onClose, txHash, secretKey }) => {
  const { t } = useTranslation()
  const [receivedEnvelope, setReceivedEnvelope] = useState<any>(null)
  const [fetching, setFetching] = useState<boolean>(true)
  const [fetchingText, setFetchingText] = useState<string>('fetchingFiles')
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
      await delay(1000)
      // setFetching(false)
      // setFetchingText('noFiles')
      setReceivedEnvelope({
        content: {
          subject: 'ASD',
          body: 'DSA',
          attachments: [
            {
              name: 'bs3386.jpg',
              URL: 'https://gateway.btfs.io/btfs/QmXjPjLwfn3AzeWm5iDw9S8TQuLHubDDXQP1B126eHeZvt',
              checksum: '4cf8dc358e90babeb909b3102d4cc0a2cbdd2e6a4a70fd5e6a48340cb20fee69',
              metadata: '{"encryption":{"type":"4th-tech-aes-gcm"}}'
            },
            {
              name: 'campaign3-png.png',
              URL: 'https://gateway.btfs.io/btfs/QmViwiAuCYWCGbiA3aYyASwwUkqhMb8fkMPjA4wGSh8GFe',
              checksum: '3d0d08cc337304c17cdc1d8e69228af34b7bd387eefe2362dc2ac94ab7da14af',
              metadata: '{"encryption":{"type":"4th-tech-aes-gcm"}}'
            },
            {
              name: 'dsc01396.jpg',
              URL: 'https://gateway.btfs.io/btfs/QmTsLXxcPv5VCsFSK8tj1ZsB5Js9Bm2ri4tL5u1cAHi11v',
              checksum: 'eaceb64d00e25a1d1d20b50cced788c41e4c6c3907b7b17171aee594c696b609',
              metadata: '{"encryption":{"type":"4th-tech-aes-gcm"}}'
            },
            {
              name: 'dsc04405-web.jpg',
              URL: 'https://gateway.btfs.io/btfs/Qmd9w7QFCCP2Vb93jjWjpMTacHPYe93BfsgwzyWhkrZxLz',
              checksum: '9bec8fb81774b54637f303da5ff885f176a519513435e208a55e645a842ef07e',
              metadata: '{"encryption":{"type":"4th-tech-aes-gcm"}}'
            }
          ]
        },
        receiver: '0x78b881eB26Db03B49239DB7cd7b2c92f95d9D63C',
        sender: '0xAAe3b0B628E1b8918a0F0C648f5FAc3cDFe61C9e',
        sentAt: 1687660860,
        openedAt: 0,
        metadata: {
          URL: 'https://gateway.btfs.io/btfs/QmPszWJZYxBtzznsRzxFt8kM3yGVfJYDxKMpNfQExeZVqe',
          checksum: 'd7a24ebc5a78b61fb044c413f8dc2d39d4614cedac56fb174f331a2c98f23360',
          transactionHash: '0x15899da773f9ba4ab5dccb49141e07b2631be134d5b1cd23c2effda46dd22200'
        }
      })
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
                    <BeatLoader size={5} loading={fetching} className='float-left mt-1.5 mr-4' color='white' />
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
