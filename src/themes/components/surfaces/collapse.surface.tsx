import React, { useEffect, useState } from 'react'
import useCollapse from 'react-collapsed'
import { Attachment, MailReadyChain, RemoteFileInfo } from '@4thtech-sdk/types'
import { ReceivedEnvelope } from '@4thtech-sdk/types/src/lib/mail.types'
import { sepolia, Mail } from '@4thtech-sdk/ethereum'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faDownload, faEnvelope, faEnvelopeOpen, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { Box, CircularProgress, Tooltip } from '@mui/material'
import { networkOptions, pollinationXConfig } from '../../../config'
import { signer } from '../../../components/layout/header'
import FileSaver from 'file-saver'
import moment from 'moment'
// import { pollinationX } from 'pollinationx-dev'
import { PollinationX } from '@4thtech-sdk/storage'
import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'

interface ICollapseProps {
  envelope: ReceivedEnvelope
  isActive?: boolean
}

interface IDownloadingFileState {
  downloading?: boolean
  downloaded?: boolean
}

let mail: Mail
const remoteStorageProvider = new PollinationX(pollinationXConfig.url, pollinationXConfig.token)

const Collapse: React.FC<ICollapseProps> = ({ envelope, isActive }) => {
  const [isExpanded, setExpanded] = useState<boolean>(isActive)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [detailsIconOpen, setDetailsIconOpen] = useState<boolean>(false)
  const [downloadingFileState, setDownloadingFileState] = useState<IDownloadingFileState[]>([])
  const { getToggleProps, getCollapseProps } = useCollapse({
    isExpanded
  })

  const initialize = async () => {
    const aes = new AesEncryption()
    await aes.importSecretKey(pollinationXConfig.secret)
    const encryptionHandler = new EncryptionHandler({
      defaultEncryption: aes
    })

    mail = new Mail({
      signer,
      chain: sepolia as MailReadyChain,
      remoteStorageProvider,
      encryptionHandler
    })
  }

  const handleDownload = async (index: number) => {
    if (downloading) return

    downloadingFileState[index] = { downloading: true, downloaded: false }
    setDownloadingFileState(downloadingFileState.slice())
    setDownloading(true)

    await initialize()
    const buffer = await mail.downloadAttachment(envelope.content.attachments[index] as RemoteFileInfo)
    FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), envelope.content.attachments[index].name)
    // const buffer2 = await pollinationX.download((envelope.content.attachments[index] as RemoteFileInfo).URL)
    // FileSaver.saveAs(new Blob([buffer2], { type: 'application/octet-stream' }), envelope.content.attachments[index].name)

    downloadingFileState[index] = { downloading: false, downloaded: true }
    setDownloadingFileState(downloadingFileState.slice())
    setDownloading(false)
  }

  useEffect(() => {
    setExpanded(isActive)
    downloadingFileState.length || setDownloadingFileState(Array(envelope.content.attachments.length).fill({ downloading: false, downloaded: false }))
  }, [isActive, setExpanded])

  return (
    <>
      <div
        {...getToggleProps({
          style: { display: 'flex' },
          onClick: () => {
            setExpanded(expanded => !expanded)
            setDetailsIconOpen(detailsIconOpen => !detailsIconOpen)
          }
        })}
      >
        <FontAwesomeIcon style={envelopeIcon} icon={detailsIconOpen ? faEnvelopeOpen : faEnvelope} />
        <Tooltip title={envelope.content.subject}>
          <b style={{ ...thumbTitle, width: 176 }}>{envelope.content.subject}</b>
        </Tooltip>
        - {moment(envelope.sentAt, 'X').format('DD MMM YYYY hh:mm A')} (Files: <b>{envelope.content.attachments.length}</b>)
        <a style={detailsTitleLink} target='_blank' href={networkOptions.network.etherscan + envelope.metadata.transactionHash}>
          TX <FontAwesomeIcon icon={faExternalLinkAlt} />
        </a>
      </div>
      <div {...getCollapseProps()}>
        <div style={{ margin: 0, paddingTop: 10, paddingLeft: 15, paddingBottom: 5 }}>
          <label style={detailsTitle}> Sender:</label>
          <p>{envelope.sender || '/'}</p>
        </div>
        <div style={{ margin: 0, paddingLeft: 15, paddingBottom: 5 }}>
          <label style={detailsTitle}> Message:</label>
          <p>{envelope.content.body || '/'}</p>
        </div>
        {envelope.content.attachments.map((attachment: Attachment, index: number) => (
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
            <div style={thumbTitle}>{attachment.name}</div>
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
  marginTop: 4,
  marginRight: 3
}

const thumbTitle: any = {
  color: '#2980b9',
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const envelopeIcon: any = {
  marginRight: 4,
  marginTop: 4
}

const thumbStatusDownloadIcon: any = {
  marginLeft: 8,
  color: '#1976d2'
}

export default Collapse
