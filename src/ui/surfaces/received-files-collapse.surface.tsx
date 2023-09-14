import FileSaver from 'file-saver'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import { Attachment, RemoteFileInfo } from '@4thtech-sdk/types'
import { ReceivedEnvelope } from '@4thtech-sdk/types/src/lib/mail.types'
import { useCollapse } from 'react-collapsed'
import { HiCheck, HiDownload, HiExternalLink, HiMail } from 'react-icons/hi'
import { Box, CircularProgress, Tooltip } from '@mui/material'
import { mail } from '@/utils/mail'
import { useNetwork } from 'wagmi'

interface ICollapseProps {
  receivedEnvelope: ReceivedEnvelope
}

interface IDownloadingFileState {
  downloading?: boolean
  downloaded?: boolean
}

const ReceivedFilesCollapse: React.FC<ICollapseProps> = ({ receivedEnvelope }) => {
  const { t } = useTranslation()
  const { chain } = useNetwork()
  const [isExpanded, setExpanded] = useState<boolean>(true)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [downloadingFileState, setDownloadingFileState] = useState<IDownloadingFileState[]>([])
  const { getToggleProps, getCollapseProps } = useCollapse({
    isExpanded
  })

  const handleDownload = async (index: number) => {
    if (downloading) return

    downloadingFileState[index] = { downloading: true, downloaded: false }
    setDownloadingFileState(downloadingFileState.slice())
    setDownloading(true)

    const buffer = await mail.downloadAttachment(receivedEnvelope.content.attachments[index] as RemoteFileInfo)
    FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), receivedEnvelope.content.attachments[index].name)

    downloadingFileState[index] = { downloading: false, downloaded: true }
    setDownloadingFileState(downloadingFileState.slice())
    setDownloading(false)
  }

  return (
    <>
      <div
        {...getToggleProps({
          style: { display: 'flex', flexDirection: 'column' },
          onClick: () => {
            setExpanded(expanded => !expanded)
          }
        })}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <label>
            <Tooltip title={receivedEnvelope.content.subject}>
              <b className='block whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer' style={{ ...blueColor, width: 176 }}>
                <HiMail className='text-2xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white float-left mr-2' />
                <div>{receivedEnvelope.content.subject}</div>
              </b>
            </Tooltip>
          </label>
          <label className='text-xs mt-1 cursor-pointer text-white'>
            {moment(receivedEnvelope.sentAt, 'X').format('DD MMM YYYY hh:mm A')} ({t('files')}: <b>{receivedEnvelope.content.attachments.length}</b>)
          </label>
        </div>
      </div>
      <div {...getCollapseProps()}>
        <div className='m-0 pt-2.5 pl-3.5 pb-3.5'>
          <a
            className='ml-3.5 mt-1.5 mr-1.5 text-xs cursor-pointer float-right'
            style={blueColor}
            target='_blank'
            href={chain.blockExplorers.default.url + '/tx/' + receivedEnvelope.metadata.transactionHash}
          >
            <u className='float-left text-white'>{t('viewTransactionOnBlockExplorer')}</u> <HiExternalLink className='float-left mt-0.5 ml-0.5' size={15} />
          </a>
        </div>
        <div className='m-0 pt-2.5 pb-1'>
          <label style={blueColor}>{t('sender')}:</label>
          <p className='text-white'>{receivedEnvelope.sender || '/'}</p>
        </div>
        <div className='m-0 pb-1 mb-5'>
          <label style={blueColor}>{t('message')}:</label>
          <p className='text-white'>{receivedEnvelope.content.body || '/'}</p>
        </div>
        {receivedEnvelope.content.attachments.map((attachment: Attachment, index: number) => (
          <div key={index} className='flex w-full'>
            {downloadingFileState[index]?.downloading ? (
              <div className='mr-2 w-3.5 h-4.5 box-border' style={blueColor}>
                <Box>
                  <CircularProgress color='inherit' size={16} />
                </Box>
              </div>
            ) : (
              <div className='mt-0.5 mr-2 w-3.5 h-4.5 box-border' style={!downloading ? thumbDownloadIcon : blueColor}>
                <HiDownload onClick={() => handleDownload(index)} />
              </div>
            )}
            <div onClick={() => handleDownload(index)} className='block whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer' style={blueColor}>
              {attachment.name}
            </div>
            {downloadingFileState[index]?.downloaded && (
              <div className='ml-2 mt-0.5' style={blueColor}>
                {<HiCheck />}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

const blueColor: any = {
  color: '#2980b9'
}

const thumbDownloadIcon: any = {
  color: '#2980b9',
  cursor: 'pointer'
}

export default ReceivedFilesCollapse
