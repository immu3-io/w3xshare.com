import useTranslation from 'next-translate/useTranslation'
import { FC, useEffect } from 'react'
import { Modal } from 'flowbite-react'
import { initMail } from '@/utils/mail'

interface IReceivedFilesModalProps {
  show: boolean
  onClose: any
  txHash: string
  secretKey: string
}

const ReceivedFilesModal: FC<IReceivedFilesModalProps> = ({ show, onClose, txHash, secretKey }) => {
  const { t } = useTranslation()

  const _handleFetchFiles = async (): Promise<void> => {
    try {
      // console.log(txHash, secretKey)
      await initMail(secretKey)
      // console.log('FETCHING FILES')
      // const envelopes = await mail.fetchByTransactionHash(txHash)
      // console.log(envelopes, 'ENVELOPES')
      // setFetching(false)
      // setFetchingText('No files')
      // setEnvelopes([envelopes])
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
        <Modal.Footer className='dark:bg-neutral-800 dark:border-0'></Modal.Footer>
      </Modal>
      {/*<SyncBackdrop open={openSyncBackdrop} text={syncBackdropText} />*/}
    </>
  )
}

export default ReceivedFilesModal
