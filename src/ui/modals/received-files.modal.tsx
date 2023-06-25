import useTranslation from 'next-translate/useTranslation'
import { FC, useEffect } from 'react'
import { Modal, Spinner } from 'flowbite-react'
import { initMail, mail } from '@/utils/mail'
import { useAccountContext } from '@/contexts/account/provider'

interface IReceivedFilesModalProps {
  show: boolean
  onClose: any
  txHash: string
  secretKey: string
}

const ReceivedFilesModal: FC<IReceivedFilesModalProps> = ({ show, onClose, txHash, secretKey }) => {
  const { t } = useTranslation()
  const { account } = useAccountContext()

  const _handleFetchFiles = async (): Promise<void> => {
    try {
      await initMail(secretKey, account.nfts[account.defaultNftIndex].endpoint, account.nfts[account.defaultNftIndex].jwt)
      console.log('FETCHING FILES')
      console.log(mail, 'MAIL')
      // console.log('MAIL PROVIDER')
      // console.log(mail.provider)
      // const envelopes = await mail.fetchByTransactionHash(txHash)
      // console.log(envelopes, 'ENVELOPES')
      // setFetching(false)
      // setFetchingText('No files')
      // setEnvelopes([envelopes])
      onClose(true)
    } catch (error) {
      console.log(error.message, '_handleFetchFiles ERROR')
    }
  }

  useEffect(() => {
    !txHash || _handleFetchFiles()
  }, [txHash])

  return (
    <>
      <Modal show={show} position='center' onClose={() => onClose(false)}>
        <Modal.Header className='dark:bg-neutral-800 dark:border-gray-700 modalHeader'>{t('receivedFiles')}</Modal.Header>
        <Modal.Body className='dark:bg-neutral-800'>
          <div className='space-y-6 p-3 overflow-x-scroll '>
            {txHash} - {secretKey}
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
