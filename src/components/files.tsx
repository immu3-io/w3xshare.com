import React, { useEffect, useState } from 'react'
import { sepolia, Mail } from '@4thtech-sdk/ethereum'
import { pollinationXConfig, receivedFileOptions } from '../config'
import { BeatLoader } from 'react-spinners'
import { ReceivedEnvelope } from '@4thtech-sdk/types/src/lib/mail.types'
import { signer } from './layout/header'
import Collapse from '../themes/components/surfaces/collapse.surface'
import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'
import { MailReadyChain } from '@4thtech-sdk/types'
import { PollinationX } from '@4thtech-sdk/storage'

interface IFilesProps {
  address?: string
}

let mail: Mail
const remoteStorageProvider = new PollinationX(pollinationXConfig.url, pollinationXConfig.token)

const Files: React.FC<IFilesProps> = ({ address }) => {
  const [envelopes, setEnvelopes] = useState<ReceivedEnvelope[]>([])
  const [fetching, setFetching] = useState<boolean>(true)
  const [fetchingText, setFetchingText] = useState<string>('Fetching files')
  const [numOfEnvelopes, setNumOfEnvelopes] = useState<number>(receivedFileOptions.numOfFilesDisplayed)
  const [showAllToggle, setShowAllToggle] = useState<boolean>(false)
  const [isExpanded] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>("")

  if (typeof window !== "undefined") {
    if (txHash.length == 0) {
      const searchParams = new URLSearchParams(document.location.search)
      if (searchParams && (searchParams.has('tx') || searchParams.get('tx'))) {
        const tx = searchParams.get('tx');
        setTxHash(tx);
      }
    }
  }

  const thumbs = envelopes.map(
    (envelope: ReceivedEnvelope, index: number) =>
      (numOfEnvelopes === 0 || index < numOfEnvelopes) && (
        <div style={infoContainer} key={index}>
          <Collapse envelope={envelope} isActive={isExpanded} />
        </div>
      )
  )

  const initialize = async () => {
    if (mail) return
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
    if (txHash.length > 0) {
      await handlefetchMailByTxHash();
    }
    else{
      await handleFetchAllMails()
    }
  }

  const handleFetchAllMails = async () => {
    // console.log(address, 'address 0x1f09b61292c9287d4969eae73503cf9a5c799ea7e10ee4004d8edcbfd91af1ea')
    // console.log(mail, 'mail')
    // const envelope = await mail.fetchByTransactionHash('0xf18b749a68c7c6f22a20d4f0aac29cf83b3000c9467fa40c349e2039b6b387a9');
    //
    // console.log(envelope);
    console.log(address, 'address')
    const envelopes = await mail.fetchAll(address)
    // const envelope = await mail.fetchByTransactionHash('0x14f973ad71065a90a2a1559ef12ed4874d5392e77d89e8f388acf0748ecf1a74')
    console.log(envelopes, 'envelopes')
    // console.log(envelope, 'envelope 0x14f973ad71065a90a2a1559ef12ed4874d5392e77d89e8f388acf0748ecf1a74')
    setFetching(false)
    setFetchingText('No files')
    setEnvelopes(envelopes)
    console.log("fetch multiple");
    console.log(envelopes);
  }

  const handlefetchMailByTxHash = async () => {
      const envelopes = await mail.fetchByTransactionHash(txHash);

      setFetching(false)
      setFetchingText('No files')
      // setEnvelopes(envelopes)

      console.log("fetch single");
      console.log(envelopes);
  }

  const handleShowAllToggle = () => {
    setNumOfEnvelopes(showAllToggle ? receivedFileOptions.numOfFilesDisplayed : 0)
    setShowAllToggle(toggle => !toggle)
  }

  useEffect(() => {
    initialize()
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
