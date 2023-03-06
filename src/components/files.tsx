import React, { useEffect, useState } from 'react'
import { Mail } from '@4thtech-sdk/ethereum'
import { networkOptions, receivedFileOptions, remoteStorageOptions } from '../config'
import { BeatLoader } from 'react-spinners'
import { ReceivedEnvelope } from '@4thtech-sdk/types/src/lib/mail.types'
import { signer } from './layout/header'
import Collapse from '../themes/components/surfaces/collapse.surface'

interface IFilesProps {
  address?: string
}

const Files: React.FC<IFilesProps> = ({ address }) => {
  const [envelopes, setEnvelopes] = useState<ReceivedEnvelope[]>([])
  const [fetching, setFetching] = useState<boolean>(true)
  const [fetchingText, setFetchingText] = useState<string>('Fetching files')
  const [numOfEnvelopes, setNumOfEnvelopes] = useState<number>(receivedFileOptions.numOfFilesDisplayed)
  const [showAllToggle, setShowAllToggle] = useState<boolean>(false)
  const [isExpanded] = useState<boolean>(false)

  const thumbs = envelopes.map(
    (envelope: ReceivedEnvelope, index: number) =>
      (numOfEnvelopes === 0 || index < numOfEnvelopes) && (
        <div style={infoContainer} key={index}>
          <Collapse envelope={envelope} isActive={isExpanded} />
        </div>
      )
  )

  const handleFetchAllMails = async () => {
    const mail = new Mail(signer, remoteStorageOptions, networkOptions)
    const envelopes = await mail.fetchAll(address)
    setFetching(false)
    setFetchingText('No files')
    setEnvelopes(envelopes)
  }

  const handleShowAllToggle = () => {
    setNumOfEnvelopes(showAllToggle ? receivedFileOptions.numOfFilesDisplayed : 0)
    setShowAllToggle(toggle => !toggle)
  }

  useEffect(() => {
    handleFetchAllMails()
  }, [])

  return (
    <div>
      {envelopes.length > 0 ? (
        <div>
          <aside>{thumbs}</aside>
          {envelopes.length > receivedFileOptions.numOfFilesDisplayed && (
            <div style={showAllContainer} onClick={handleShowAllToggle}>
              {showAllToggle ? 'Show less' : 'Show all'}
            </div>
          )}
        </div>
      ) : (
        <div style={thumbsContainer}>
          <div>{fetchingText}</div>
          <div style={{ marginLeft: 4 }}>
            <BeatLoader color='#1976d2' loading={fetching} size={5} />
          </div>
        </div>
      )}
    </div>
  )
}

const thumbsContainer: any = {
  display: 'flex',
  width: '100%'
}

const infoContainer: any = {
  border: '1px solid white',
  padding: 5,
  borderRadius: 5,
  marginBottom: 10,
  cursor: 'pointer'
}

const showAllContainer: any = {
  textAlign: 'center',
  marginTop: 24,
  cursor: 'pointer'
}

export default Files
