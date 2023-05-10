import React, { useCallback, useEffect, useRef, useState } from 'react'
import validator from 'validator'
import axios from 'axios'
import Dropzone from '../themes/ui/drop-zone'
import TextField from '../themes/components/inputs/text-field.input'
import TextareaField from '../themes/components/inputs/textarea-field.input'
import { imgToSVG, isAddress, truncateAddress } from '../utils'
import { notify } from '../utils/notify'
import { sepolia, Mail } from '@4thtech-sdk/ethereum'
import { Envelope, MailReadyChain } from '@4thtech-sdk/types'
import { signer } from './layout/header'
import { PollinationX } from '@4thtech-sdk/storage'
import { pollinationXConfig } from '../config'
import { AesEncryption, EncryptionHandler } from '@4thtech-sdk/encryption'

interface ITransferProps {
  address: string
}
const aes = new AesEncryption()

let mail: Mail
const remoteStorageProvider = new PollinationX(pollinationXConfig.url, pollinationXConfig.token)
const Transfer: React.FC<ITransferProps> = ({ address }) => {
  const [files, setFiles] = useState<any[]>([])
  // const [percentage, setPercentage] = useState<number>(0)
  const [secret, setSecret] = useState<string>('')
  const [tx, setTx] = useState<any>(0)
  const [progressLabel, setProgressLabel] = useState<string>('')
  const [canTransfer, setCanTransfer] = useState<boolean>(false)
  const [copy, setCopy] = useState<string>('Click To Copy!')
  const [showPercentage, setShowPercentage] = useState<boolean>(false)
  const formRef = useRef(null)

  const generateSecretKey = async () => {
    if (secret.length == 0) {
      await aes.generateSecretKey()
      setSecret(await aes.exportSecretKey())
    }
  }
  generateSecretKey()

  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText(copyMe)
      setCopy('Copied!')
      setCanTransfer(true)
    } catch (err) {
      setCopy('Failed to copy!')
      setCanTransfer(false)
    }
  }

  const initialize = async () => {
    if (mail) return
    await aes.importSecretKey(secret)
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

  const handleUpload = useCallback(
    async event => {
      event.preventDefault()

      if (!formRef.current.checkValidity()) {
        formRef.current.reportValidity()
        return
      }

      if (!isAddress(formRef.current.recipientAccount.value)) {
        notify('Invalid recipient account', 'warning')
        return
      }

      if (!validator.isEmail(formRef.current.email.value)) {
        notify('Invalid email', 'warning')
        return
      }

      if (!validator.isEmail(formRef.current.recipientEmail.value)) {
        notify('Invalid recipient email', 'warning')
        return
      }

      await initialize()
      const sender = await signer.getAddress()
      // const uploadProgress = document.querySelector('.upload_progress')
      // const strokeSolid: any = uploadProgress.querySelector('.stroke-solid')

      // uploadProgress.classList.add('active')
      // strokeSolid.style.strokeDashoffset = 300
      // setPercentage(0)
      setShowPercentage(true)
      setProgressLabel('Uploading files...')
      try {
        const envelope: Envelope = {
          content: {
            subject: formRef.current.title.value,
            body: formRef.current.message.value,
            attachments: []
          },
          receiver: formRef.current.recipientAccount.value,
          sender
        }

        for (const file of files.values()) {
          // const blob = await getBlob(file)
          // const attachment = encoder.encode(file)

          envelope.content.attachments.push({
            name: file.name,
            content: new Blob([file])
          })
          // const blob = await getBlob(file)
          // envelope.content.attachments.push({
          //   name: file.name,
          //   path: blob
          // })
        }

        // const mail = new Mail(signer, remoteStorageOptions, networkOptions)
        const response = await mail.send(envelope)
        setProgressLabel('Sending...')
        setTx(response.hash)
        await response.wait(1)

        // strokeSolid.style.strokeDashoffset = 300 - 300
        // setPercentage(100)

        await axios({
          method: 'POST',
          url: '/api/mailer',
          data: {
            email: formRef.current.email.value,
            hash: response.hash,
            recipientEmail: formRef.current.recipientEmail.value,
            recipientAccount: formRef.current.recipientAccount.value,
            senderWallet: sender,
            title: formRef.current.title.value,
            message: formRef.current.message.value || '/'
          }
        })
          .then(() => {
            formRef.current.email.value = ''
            formRef.current.recipientAccount.value = ''
            formRef.current.recipientEmail.value = ''
            formRef.current.title.value = ''
            formRef.current.message.value = ''
            setFiles([])
            setCanTransfer(false)
            setSecret('')
            notify('Files have been successfully transferred')
          })
          .catch(() => {
            notify('An error occurred. Try again later', 'error')
          })
          .finally(() => {
            // strokeSolid.style.strokeDashoffset = 300
            // uploadProgress.classList.remove('active')
            setShowPercentage(false)
            setTx(0)
          })
      } catch (error) {
        notify('Some error occurred during upload. Try again later', 'error')
        setTx(0)
        // strokeSolid.style.strokeDashoffset = 300
        // uploadProgress.classList.remove('active')
        setShowPercentage(false)
      }
    },
    [files]
  )

  useEffect(() => {
    imgToSVG()
  }, [])

  return (
    <>
      <Dropzone multiple={true} uploadedFiles={files} onDropFiles={setFiles} onChangeFiles={setFiles} />
      {files.length > 0 && (
        <div className='nav_menu_form_wrapper mt-24'>
          <form ref={formRef}>
            <div className='nav_menu_buttons nav_menu_form'>
              <div className='input_list mr-24'>
                <ul>
                  <li>
                    <TextField label='Sender Wallet' name='account' value={truncateAddress(address)} disabled />
                  </li>
                  <li>
                    <TextField label='Sender Email' name='email' required />
                  </li>
                </ul>
              </div>
              <div className='input_list'>
                <ul>
                  <li>
                    <TextField label='Recipient Wallet' name='recipientAccount' required />
                  </li>
                  <li>
                    <TextField label='Recipient Email' name='recipientEmail' required />
                  </li>
                </ul>
              </div>
            </div>
            <div className='nav_menu_form input_list mt-8'>
              <ul>
                <li>
                  <TextField label='Title' name='title' style={{ width: '100%' }} required />
                </li>
                <li>
                  <TextareaField label='Message' name='message' />
                </li>
                <li>
                  <TextField label='Secret Key' value={secret} name='secretKey' disabled required />
                  {canTransfer ? (
                    <label style={{ width: '100%', color: '#f23032', fontWeight: 'bold', textAlign: 'left', marginTop: '5px', fontSize: '12px' }}>{copy}</label>
                  ) : (
                    <div style={{ width: '100%', color: '#f23032', fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                      <label>
                        Note!
                        <br />
                        Secret key needs to be shared with recipient, to be able decrypt message. Copy it!
                      </label>
                      <label
                        style={{ margin: '0 auto', marginTop: '20px', cursor: 'pointer' }}
                        className='w3xshare_fn_button only_text'
                        onClick={() => copyToClipBoard(secret)}
                      >
                        {copy}
                      </label>
                    </div>
                  )}
                </li>
                {canTransfer && (
                  <li className='mt-16 float-right'>
                    <a id='send_message' className='w3xshare_fn_button only_text' onClick={handleUpload}>
                      <span className='text'>Transfer</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
            {showPercentage && (
              <div>
                <div className='loaderOverlay'></div>
                <svg className='spinner' viewBox='0 0 50 50'>
                  <circle className='path' cx='25' cy='25' r='20' fill='none' strokeWidth='5'></circle>
                </svg>
                <p className='spinnerText'>{progressLabel}</p>
                {tx != 0 && (
                  <p className='spinnerTxHash'>
                    <a target='_blank' href={`https://sepolia.etherscan.io/tx/${tx}`}>
                      <u>View on block explorer</u>
                    </a>
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  )
}
export default Transfer
