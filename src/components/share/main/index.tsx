import validator from 'validator'
import useTranslation from 'next-translate/useTranslation'
import UploadFileDropzone from '@/ui/dropzones/upload-file.dropzone'
import axios from 'axios'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Envelope } from '@4thtech-sdk/types'
import { useAccountContext } from '@/contexts/account/provider'
import { HiDocument, HiExternalLink, HiX } from 'react-icons/hi'
import { BeatLoader } from 'react-spinners'
import { formatBytes, isAddress, truncateAddress } from '@/utils/helper'
import { toastify } from '@/utils/toastify'
import { Label, TextInput } from 'flowbite-react'
import { aes, initMail, mail, signer } from '@/utils/mail'
import * as _ from 'lodash'
import { format } from 'date-fns'
import JSZip from 'jszip'
import SyncBackdropSteps from '@/ui/backdrops/sync.backdropSteps'

const MAX_SIZE = 100 * 1024 * 1024 // 100 MB in bytes
let stepHistory = []

const Main: FC = () => {
  const { t } = useTranslation()
  const { account } = useAccountContext()
  const [files, setFiles] = useState<any[]>([])
  const [totalSize, setTotalSize] = useState<number>(0)
  const [secretKey, setSecretKey] = useState<string>('')
  const [copy, setCopy] = useState<string>('')
  const [tx, setTx] = useState<string>('')
  const [progressLabel, setProgressLabel] = useState<string>('')
  const [sendSecretKey, setSendSecretKey] = useState<boolean>(false)
  const [canTransfer, setCanTransfer] = useState<boolean>(false)
  const [showPercentage, setShowPercentage] = useState<boolean>(false)
  const formRef = useRef(null)
  const [openSyncBackdrop, setOpenSyncBackdrop] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState('')

  const updateStep = stepText => {
    stepHistory.push(stepText)
    setCurrentStep(stepText)
  }

  const handleFileOnDrop = (acceptedFiles: any[]): void => {
    let size = totalSize
    const updatedFiles = [...files]
    acceptedFiles.forEach(file => {
      if (size + file.size <= MAX_SIZE) {
        updatedFiles.push(file)
        size += file.size
      } else {
        toastify(`File "${file.name}" is too large (Max ${MAX_SIZE / (1024 * 1024)} MB)`, 'error')
      }
    })
    if (updatedFiles.length > 0) {
      setFiles(updatedFiles)
      setTotalSize(size)
    }
  }

  const handleRemoveFileOnClick = (index: number): void => {
    files.splice(index, 1)
    setFiles(_.cloneDeep(files))
    setTotalSize(_.cloneDeep(files).reduce((total, file) => total + file.size, 0))
  }

  const handleCopyToClipBoard = async (text: string, sendSecretKeyToRecipient: boolean = false): Promise<void> => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      if (!sendSecretKeyToRecipient) {
        setCopy(t('copied'))
        setSendSecretKey(false)
      } else {
        setCopy(t('secretKeySendToRecipient'))
        setSendSecretKey(true)
      }
      setCanTransfer(true)
    } catch (error) {
      setCopy(t('failed'))
      setCanTransfer(false)
    }
  }

  const handleUpload = useCallback(
    async event => {
      event.preventDefault()
      if (!formRef.current.checkValidity()) {
        formRef.current.reportValidity()
        return
      }
      if (!validator.isEmail(formRef.current.senderEmail.value)) {
        toastify(t('invalidEmail'), 'warning')
        return
      }
      if (!isAddress(formRef.current.recipientWallet.value)) {
        toastify(t('invalidRecipientWallet'), 'warning')
        return
      }
      if (!validator.isEmail(formRef.current.recipientEmail.value)) {
        toastify(t('invalidRecipientEmail'), 'warning')
        return
      }
      // const uploadProgress = document.querySelector('.upload_progress')
      // const strokeSolid: any = uploadProgress.querySelector('.stroke-solid')
      // uploadProgress.classList.add('active')
      // strokeSolid.style.strokeDashoffset = 300
      // setPercentage(0)
      setOpenSyncBackdrop(true)
      setShowPercentage(false)
      setProgressLabel(t('uploadingFiles'))
      try {
        await initMail(formRef.current.secretKey.value.trim(), account.nfts[account.defaultNftIndex].endpoint, account.nfts[account.defaultNftIndex].jwt)
        const sender = await signer.getAddress()
        const envelope: Envelope = {
          content: {
            subject: formRef.current.title.value,
            body: formRef.current.message.value,
            attachments: []
          },
          receiver: formRef.current.recipientWallet.value,
          sender
        }

        if (files.length > 1) {
          const zip = new JSZip()
          for (const file of files) {
            zip.file(file.name, file)
          }
          const currentDateTime = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
          const randomId = files.length
          const zipFileName = `w3xshare_${currentDateTime}_${randomId}.zip`
          const zipBlob = await zip.generateAsync({ type: 'blob' })
          envelope.content.attachments.push({
            name: zipFileName,
            content: zipBlob
          })
        } else {
          for (const file of files) {
            envelope.content.attachments.push({
              name: file.name,
              content: new Blob([file])
            })
          }
        }

        // const response = await mail.send(envelope)
        const response = await mail.send({
          envelope,
          onStateChange: state => {
            updateStep(state)
          },
          onUploadProgress: progressInfo => {
            console.log(`Upload Progress (${progressInfo.fileName}): ${progressInfo.percent}%`)
          }
        })

        await response.wait(1)
        setTx(response.hash)
        // strokeSolid.style.strokeDashoffset = 300 - 300
        // setPercentage(100)
        updateStep('SENDING_EMAIL')

        await axios({
          method: 'POST',
          url: '/api/mailer',
          data: {
            hash: response.hash,
            secret: sendSecretKey ? formRef.current.secretKey.value : false,
            senderWallet: account.address,
            senderEmail: formRef.current.senderEmail.value,
            recipientWallet: formRef.current.recipientWallet.value,
            recipientEmail: formRef.current.recipientEmail.value,
            title: formRef.current.title.value,
            message: formRef.current.message.value || '/'
          }
        })
          .then(() => {
            formRef.current.senderEmail.value = ''
            formRef.current.recipientWallet.value = ''
            formRef.current.recipientEmail.value = ''
            formRef.current.title.value = ''
            formRef.current.message.value = ''
            setFiles([])
            setCanTransfer(false)
            setSendSecretKey(false)
            setOpenSyncBackdrop(false)
            stepHistory = []
            setSecretKey('')
            toastify(t('filesHaveBeenSuccessfullyTransferred'))
          })
          .catch(() => {
            toastify(t('errorOccurred'), 'error')
          })
          .finally(() => {
            // strokeSolid.style.strokeDashoffset = 300
            // uploadProgress.classList.remove('active')
            setShowPercentage(false)
            setOpenSyncBackdrop(false)
            stepHistory = []
            setTx('')
          })
      } catch (error) {
        toastify(error.message, 'error')
        setTx('')
        // strokeSolid.style.strokeDashoffset = 300
        // uploadProgress.classList.remove('active')
        setShowPercentage(false)
        setOpenSyncBackdrop(false)
        stepHistory = []
      }
    },
    [files, sendSecretKey]
  )

  const handleNewFiles = files.map((file, index: number) => (
    <div key={file.name} style={thumbsContainer}>
      <div style={{ ...thumbIcon }}>
        <HiDocument />
      </div>
      <div style={thumbTitle}>
        {file.name} ({formatBytes(file.size)})
      </div>
      <div style={thumbIconWrapper}>
        <HiX onClick={() => handleRemoveFileOnClick(index)} />
      </div>
    </div>
  ))

  const _handleGenerateSecretKey = async (): Promise<void> => {
    await aes.generateSecretKey()
    setSecretKey(await aes.exportSecretKey())
  }

  useEffect(() => {
    _handleGenerateSecretKey()
  }, [])

  return (
    <>
      <div className='h-max pt-14 sm:ml-64 bg-neutral-50 dark:bg-neutral-800'>
        <div className='py-3 mt-10 sm:py-5 mt-lg:col-span-2'>
          {account?.nfts?.length > 0 && (
            <>
              <div className='grid grid-cols-1 gap-1'>
                <div>
                  <UploadFileDropzone onDrop={handleFileOnDrop} />
                </div>
              </div>
              {files.length > 0 && (
                <form ref={formRef}>
                  <div className='grid grid-cols-2 gap-2 p-16'>
                    <div className='text-white'>
                      {totalSize > 0 && (
                        <p>
                          {t('totalSizeOfDroppedFiles')}: {formatBytes(totalSize)} MB
                        </p>
                      )}
                      <aside className='mt-4'>{handleNewFiles}</aside>
                    </div>
                    <div>
                      <div className='grid grid-cols-2 gap-2'>
                        <div className='mb-4'>
                          <div className='mb-1 block'>
                            <Label htmlFor='senderWallet' value={t('senderWallet')} />
                          </div>
                          <TextInput id='senderWallet' name='senderWallet' value={truncateAddress(account.address)} disabled={true} />
                          <div className='mb-1 mt-4 block'>
                            <Label htmlFor='senderEmail' value={t('senderEmail')} />
                          </div>
                          <TextInput id='senderEmail' name='senderEmail' />
                        </div>
                        <div className='mb-4'>
                          <div className='mb-1 block'>
                            <Label htmlFor='recipientWallet' value={t('recipientWallet')} />
                          </div>
                          <TextInput id='recipientWallet' name='recipientWallet' />
                          <div className='mb-1 mt-4 block'>
                            <Label htmlFor='recipientEmail' value={t('recipientEmail')} />
                          </div>
                          <TextInput id='recipientEmail' name='recipientEmail' />
                        </div>
                      </div>
                      <div className='mb-4'>
                        <div className='mb-1 block'>
                          <Label htmlFor='title' value={t('title')} />
                        </div>
                        <TextInput id='title' name='title' />
                      </div>
                      <div className='mb-4'>
                        <div className='mb-1 block'>
                          <Label htmlFor='message' value={t('message')} />
                        </div>
                        <TextInput id='message' name='message' />
                      </div>
                      <div className='mb-4'>
                        <div className='mb-1 block'>
                          <Label htmlFor='secretKey' value={t('secretKey')} />
                        </div>
                        <TextInput id='secretKey' name='secretKey' value={secretKey} disabled={true} />
                      </div>
                      <div className='mb-4 text-center text-red-600'>
                        <label>
                          {t('note')}!
                          <br />
                          {t('secretKeyNote')}
                        </label>
                      </div>
                      {canTransfer ? (
                        <div className='text-center text-red-600'>{copy}</div>
                      ) : (
                        <div className='grid grid-cols-2 gap-2 text-center'>
                          <div>
                            <button
                              type='button'
                              onClick={() => handleCopyToClipBoard(secretKey)}
                              className='relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 mt-4
                                          overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br
                                          from-pollinationx-honey to-pollinationx-purple group-hover:from-pollinationx-honey group-hover:to-pollinationx-purple
                                          hover:text-white dark:text-white focus:outline-none focus:ring-0
                                          dark:focus:ring-blue-800'
                            >
                              <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-neutral-900 rounded-md group-hover:bg-opacity-0'>
                                {t('copySecretKey')}
                              </span>
                            </button>
                          </div>
                          <div>
                            <button
                              type='button'
                              onClick={() => handleCopyToClipBoard(secretKey, true)}
                              className='relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 mt-4
                                          overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br
                                          from-pollinationx-honey to-pollinationx-purple group-hover:from-pollinationx-honey group-hover:to-pollinationx-purple
                                          hover:text-white dark:text-white focus:outline-none focus:ring-0
                                          dark:focus:ring-blue-800'
                            >
                              <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-neutral-900 rounded-md group-hover:bg-opacity-0'>
                                {t('sendToRecipient')}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                      {canTransfer && !showPercentage && (
                        <div className='text-center'>
                          <button
                            type='button'
                            onClick={handleUpload}
                            className='relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 mt-4
                                          overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br
                                          from-pollinationx-honey to-pollinationx-purple group-hover:from-pollinationx-honey group-hover:to-pollinationx-purple
                                          hover:text-white dark:text-white focus:outline-none focus:ring-0
                                          dark:focus:ring-blue-800'
                          >
                            <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-neutral-900 rounded-md group-hover:bg-opacity-0'>
                              {t('transfer')}
                            </span>
                          </button>
                        </div>
                      )}
                      {showPercentage && (
                        <div className='mt-8'>
                          <div className='w-full float-left'>
                            <p className='pt-1 text-white float-left'>{progressLabel}</p>
                            <BeatLoader size={5} className='float-left mt-1.5 mr-4' color='white' />
                          </div>
                          {tx && (
                            <div className='text-white'>
                              <a target='_blank' href={`https://mumbai.polygonscan.com/tx/${tx}`} className='float-left'>
                                <u>{t('viewTransactionOnBlockExplorer')}</u> <HiExternalLink className='float-right w-5 h-5 mt-1 ml-1' />
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      <SyncBackdropSteps open={openSyncBackdrop} currentStep={currentStep} history={stepHistory} />
    </>
  )
}

const thumbsContainer: any = {
  display: 'flex',
  width: '100%'
}
const thumbIcon: any = {
  marginRight: 8,
  width: 14,
  height: 18,
  boxSizing: 'border-box',
  color: '#2980b9'
}
const thumbTitle: any = {
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}
const thumbIconWrapper: any = {
  color: 'red',
  marginLeft: 8,
  cursor: 'pointer',
  paddingTop: 2
}

export default Main
