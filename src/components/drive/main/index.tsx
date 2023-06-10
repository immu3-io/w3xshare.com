import useTranslation from 'next-translate/useTranslation'
import UploadFileDropzone from '@/ui/dropzones/upload-file.dropzone'
import SyncBackdrop from '@/ui/backdrops/sync.backdrop'
import UploadToast from '@/ui/toasts/upload.toast'
import { FC, useEffect, useState } from 'react'
import { IFile } from '@/components/drive/types'
import { SyncContentColorEnum } from '@/enums/sync-content-color.enum'
import { useAccountContext } from '@/contexts/account/provider'
import { useIndexedDBContext } from '@/contexts/indexed-db/provider'
import * as _ from 'lodash'

const Main: FC = () => {
  const { t } = useTranslation()
  const { account, setAccount } = useAccountContext()
  const { indexedDB } = useIndexedDBContext()
  const [showUploadToast, setShowUploadToast] = useState<boolean>(false)
  const [openSyncBackdrop, setOpenSyncBackdrop] = useState<boolean>(false)
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false)
  const [uploadFileCounter, setUploadFileCounter] = useState<number>(0)
  const [uploadFileCount, setUploadFileCount] = useState<number>(0)
  const [uploadFileName, setUploadFileName] = useState<string>('')
  const [uploadBtnColor, setUploadBtnColor] = useState<SyncContentColorEnum>(SyncContentColorEnum.SYNCED)
  const [syncBackdropText, setSyncBackdropText] = useState<string>('')
  const [files, setFiles] = useState<IFile[]>([])

  const handleFileOnDrop = async (acceptedFiles: any[]): Promise<void> => {
    // const newFiles = await _handleFiles(
    //   acceptedFiles.map((file: File) => ({
    //     id: uuidv4(),
    //     name: file.name,
    //     image: '/img/file.png',
    //     type: 'file',
    //     status: 'pending',
    //     createdAt: `${Date.now()}`,
    //     size: file.size,
    //     file
    //   }))
    // )
    // enqueue(newFiles as IFile[])
    // updateFolderStatusOnNewFile(newFiles[0].id)(account.nfts[account.defaultNftIndex]?.files || [])
    // await _handleUpdateIndexDB()
    // setUploadFileCount(prevCount => prevCount + newFiles.length)
  }

  const handleFileOnDelete = async (id: string): Promise<void> => {
    // account.nfts[account.defaultNftIndex].files = recursiveRemoveBy(id)(account.nfts[account.defaultNftIndex]?.files || [])
    // !folder || updateFolderStatusOnDeleteFile(folder.id)(account.nfts[account.defaultNftIndex]?.files || [])
    // await _handleRefreshFiles()
    // _handleCountPendingFiles()
  }

  const _handleUpdateIndexDB = async (): Promise<void> => {
    setAccount(_.cloneDeep(account))
    await indexedDB.put(account)
  }

  return (
    <div className='h-max pt-14 sm:ml-64 bg-neutral-50 dark:bg-neutral-800'>
      <div className='py-3 mt-10 sm:py-5 mt-lg:col-span-2'>
        {account?.nfts?.length > 0 && (
          <div className='grid grid-cols-4 gap-4'>
            <div>
              <UploadFileDropzone onDrop={handleFileOnDrop} />
            </div>
          </div>
        )}
      </div>
      <SyncBackdrop open={openSyncBackdrop} text={syncBackdropText} />
      <UploadToast show={showUploadToast} filename={uploadFileName} counter={uploadFileCounter} count={uploadFileCount} />
    </div>
  )
}

export default Main
