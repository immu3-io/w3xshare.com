import React, { useEffect, useState } from 'react'
import useCollapse from 'react-collapsed'
import { Attachment, MailReadyChain, RemoteFileInfo } from '@4thtech-sdk/types'
import { ReceivedEnvelope } from '@4thtech-sdk/types/src/lib/mail.types'
import { sepolia, Mail } from '@4thtech-sdk/ethereum'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDownload, faEnvelope, faEnvelopeOpen, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { Box, CircularProgress, Tooltip } from '@mui/material'
import FileSaver from 'file-saver'
import moment from 'moment'
// import { pollinationX } from 'pollinationx-dev'
import { PollinationX } from '@4thtech-sdk/storage'
import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'

interface ICollapseProps {
  receivedEnvelope: ReceivedEnvelope
}

interface IDownloadingFileState {
  downloading?: boolean
  downloaded?: boolean
}

const ReceivedFilesCollapse: React.FC<ICollapseProps> = ({ receivedEnvelope }) => {
  const [isExpanded, setExpanded] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [detailsIconOpen, setDetailsIconOpen] = useState<boolean>(false)
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
    // const buffer2 = await pollinationX.download((envelope.content.attachments[index] as RemoteFileInfo).URL)
    // FileSaver.saveAs(new Blob([buffer2], { type: 'application/octet-stream' }), envelope.content.attachments[index].name)

    downloadingFileState[index] = { downloading: false, downloaded: true }
    setDownloadingFileState(downloadingFileState.slice())
    setDownloading(false)
  }

  // useEffect(() => {
  //   setExpanded(isActive)
  //   downloadingFileState.length || setDownloadingFileState(Array(receivedEnvelope.content.attachments.length).fill({ downloading: false, downloaded: false }))
  // }, [isActive, setExpanded])
  //   <div style={showAllContainer} onClick={handleShowAllToggle}>
  //       {showAllToggle ? t('showLess') : t('showAll')}
  // </div>
  return (
    <>
      <div
        {...getToggleProps({
          style: { display: 'flex', flexDirection: 'column' },
          onClick: () => {
            setExpanded(expanded => !expanded)
            setDetailsIconOpen(detailsIconOpen => !detailsIconOpen)
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
              <b style={{ ...thumbTitle, width: 176 }}>
                {' '}
                <FontAwesomeIcon style={envelopeIcon} icon={detailsIconOpen ? faEnvelopeOpen : faEnvelope} /> {receivedEnvelope.content.subject}
              </b>
            </Tooltip>
          </label>
          <label
            style={{
              fontSize: '12px',
              marginTop: 4,
              cursor: 'pointer'
            }}
          >
            {moment(receivedEnvelope.sentAt, 'X').format('DD MMM YYYY hh:mm A')} (Files: <b>{receivedEnvelope.content.attachments.length}</b>)
          </label>
        </div>
      </div>
      <div {...getCollapseProps()}>
        <div style={{ margin: 0, paddingTop: 10, paddingLeft: 15, paddingBottom: 15 }}>
          <a style={detailsTitleLink} target='_blank' href={networkOptions.network.etherscan + receivedEnvelope.metadata.transactionHash}>
            <u>View transaction on block explorer</u> <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </div>
        <div style={{ margin: 0, paddingTop: 10, paddingLeft: 15, paddingBottom: 5 }}>
          <label style={detailsTitle}> Sender:</label>
          <p>{receivedEnvelope.sender || '/'}</p>
        </div>
        <div style={{ margin: 0, paddingLeft: 15, paddingBottom: 5 }}>
          <label style={detailsTitle}> Message:</label>
          <p>{receivedEnvelope.content.body || '/'}</p>
        </div>
        {receivedEnvelope.content.attachments.map((attachment: Attachment, index: number) => (
          <div key={index} style={thumbsContainer}>
            {downloadingFileState[index]?.downloading ? (
              <div style={{ ...thumbDownloadingIcon }}>
                <Box>
                  <CircularProgress color='inherit' size={16} />
                </Box>
              </div>
            ) : (
              <div style={!downloading ? { ...thumbDownloadIcon } : { ...thumbDownloadDisabledIcon }}>
                <FontAwesomeIcon icon={faDownload} onClick={() => handleDownload(index)} />
              </div>
            )}
            <div onClick={() => handleDownload(index)} style={thumbTitle}>
              {attachment.name}
            </div>
            {downloadingFileState[index]?.downloaded && (
              <div style={{ ...thumbStatusDownloadIcon }}>
                <FontAwesomeIcon icon={faCheck} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

const thumbsContainer: any = {
  display: 'flex',
  width: '100%',
  paddingLeft: 15
}

const thumbDownloadIcon: any = {
  marginRight: 8,
  width: 14,
  height: 18,
  boxSizing: 'border-box',
  color: '#2980b9',
  cursor: 'pointer'
}

const thumbDownloadDisabledIcon: any = {
  marginRight: 8,
  width: 14,
  height: 18,
  boxSizing: 'border-box',
  color: '#EBEBE4'
}

const thumbDownloadingIcon: any = {
  marginRight: 8,
  paddingTop: 2,
  width: 14,
  height: 18,
  boxSizing: 'border-box',
  color: '#2980b9'
}

const detailsTitle: any = {
  color: '#2980b9'
}

const detailsTitleLink: any = {
  color: '#2980b9',
  cursor: 'pointer',
  marginLeft: 10,
  float: 'right',
  marginTop: 3,
  marginRight: 3,
  fontSize: '12px'
}

const thumbTitle: any = {
  color: '#2980b9',
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  cursor: 'pointer'
}

const envelopeIcon: any = {
  marginRight: 4,
  marginTop: 4
}

const thumbStatusDownloadIcon: any = {
  marginLeft: 8,
  color: '#1976d2'
}

export default ReceivedFilesCollapse
