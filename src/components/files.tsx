import React, { useRef, useState } from 'react'
import { sepolia, Mail } from '@4thtech-sdk/ethereum'
import { pollinationXConfig, receivedFileOptions } from '../config'
import { BeatLoader } from 'react-spinners'
import { ReceivedEnvelope } from '@4thtech-sdk/types/src/lib/mail.types'
import { signer } from './layout/header'
import Collapse from '../themes/components/surfaces/collapse.surface'
import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'
import { MailReadyChain } from '@4thtech-sdk/types'
import { PollinationX } from '@4thtech-sdk/storage'
import TextareaField from '../themes/components/inputs/textarea-field.input'
import { notify } from '../utils/notify'

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
  const [isExpanded] = useState<boolean>(true)
  const [txHash, setTxHash] = useState<string>('')
  const [secretKeyInput, setSecretKeyInput] = useState<boolean>(true)
  const [secret, setSecret] = useState<string>('')
  const formRef = useRef(null)

  if (typeof window !== 'undefined') {
    if (txHash.length == 0) {
      const searchParams = new URLSearchParams(document.location.search)
      if (searchParams && (searchParams.has('tx') || searchParams.get('tx'))) {
        const tx = searchParams.get('tx')
        console.log('tx')
        console.log(tx)
        console.log('.tx')
        setTxHash(tx)
      }
      if (searchParams && (searchParams.has('s') || searchParams.get('s'))) {
        setSecret(searchParams.get('s'))
      }
    }
  }

  const thumbs = envelopes.map(
    (envelope: ReceivedEnvelope, index: number) =>
      (numOfEnvelopes === 0 || index < numOfEnvelopes) && (
        <div style={infoContainer} key={index}>
          <Collapse envelope={envelope} isActive={isExpanded} secretKey={secret} />
        </div>
      )
  )

  const handleFetchAllMails = async () => {
    console.log('address, handleFetchAllMails')
    console.log(address)
    console.log('.address, handleFetchAllMails')

    const envelopes = await mail.fetchAll(address)
    setFetching(false)
    setFetchingText('No files')
    setEnvelopes(envelopes)
  }

  const handleFetchMailByTxHash = async () => {
    console.log('txHash, handleFetchMailByTxHash')
    console.log(txHash)
    console.log('.txHash, handleFetchMailByTxHash')
    const envelopes = await mail.fetchByTransactionHash(txHash)

    setFetching(false)
    setFetchingText('No files')
    setEnvelopes([envelopes])
  }

  const handleShowAllToggle = () => {
    setNumOfEnvelopes(showAllToggle ? receivedFileOptions.numOfFilesDisplayed : 0)
    setShowAllToggle(toggle => !toggle)
  }

  const handleFetch = async e => {
    e.preventDefault()

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    const secretKey = formRef.current.secretKey.value.replace(/\s/g, '')
    if (secretKey.length !== 64) {
      notify(
        'Invalid secret key. Secret key length should be 64 characters. Your is ' + formRef.current.secretKey.value.length + ' characters long.',
        'warning'
      )
      return
    }

    setSecret(secretKey)
    setSecretKeyInput(false)

    const aes = new AesEncryption()
    console.log('secretKey')
    console.log(secretKey)
    console.log('.secretKey')
    await aes.importSecretKey(secretKey)
    const encryptionHandler = new EncryptionHandler({
      defaultEncryption: aes
    })

    mail = new Mail({
      signer,
      chain: sepolia as MailReadyChain,
      remoteStorageProvider,
      encryptionHandler
    })
    console.log('txHash, handleFetch')
    console.log(txHash)
    console.log('.txHash, handleFetch')
    if (txHash.length > 0) {
      await handleFetchMailByTxHash()
    } else {
      await handleFetchAllMails()
    }
  }

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
          <form ref={formRef}>
            <div className='nav_menu_form input_list mt-8'>
              <ul>
                {secretKeyInput ? (
                  <li>
                    <TextareaField label='Secret Key' value={secret} name='secretKey' required />
                    <div style={{ width: '100%', color: '#f23032', fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                      <label>
                        Note!
                        <br />
                        Please enter secret key received by the sender. Only with secret key you will be able download files.
                      </label>
                    </div>
                  </li>
                ) : (
                  <li>
                    <div>{fetchingText}</div>
                    <div style={{ marginLeft: 4 }}>
                      <BeatLoader color='#1976d2' loading={fetching} size={5} />
                    </div>
                  </li>
                )}
                {secretKeyInput && (
                  <li className='mt-16 float-right'>
                    <a className='w3xshare_fn_button only_text' onClick={handleFetch}>
                      <span className='text'>Get files</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </form>
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
  marginBottom: 10
}

const showAllContainer: any = {
  textAlign: 'center',
  marginTop: 24,
  cursor: 'pointer'
}

export default Files
