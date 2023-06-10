import FileSaver from 'file-saver'
import useTranslation from 'next-translate/useTranslation'
import EditNameModal from '@/ui/modals/edit-name.modal'
import { FC, useState } from 'react'
import { IFile } from '@/components/drive/types'
import { HiDownload, HiOutlinePencilAlt, HiTrash } from 'react-icons/hi'
import { useAccountContext } from '@/contexts/account/provider'
import { Dropdown } from 'flowbite-react'
import { pollinationX } from '@pollinationx/core'
import { decrypt } from '@/utils/crypto'

interface IFileSettingsDropdownProps {
  file: IFile
  onEdit: any
  onDelete: any
}

const FileSettingsDropdown: FC<IFileSettingsDropdownProps> = ({ file, onEdit, onDelete }) => {
  const { t } = useTranslation()
  const { account } = useAccountContext()
  const [showEditNameModal, setShowEditNameModal] = useState<boolean>(false)

  const handleDownloadOnClick = async (file: IFile): Promise<void> => {
    pollinationX.init({
      url: account.nfts[account.defaultNftIndex].endpoint,
      token: account.nfts[account.defaultNftIndex].jwt
    })
    FileSaver.saveAs(
      new Blob([await pollinationX.download(file.hash, decrypt(account.nfts[account.defaultNftIndex].secret))], { type: 'application/octet-stream' }),
      file.name
    )
  }

  const handleOnClose = (name?: string): void => {
    setShowEditNameModal(false)
    onEdit(name)
  }

  return (
    <>
      <Dropdown
        className='bg-transparent dark:bg-neutral-700 shadow-0
                divide-0 border-none text-neutral-900 dark:border-none'
        arrowIcon={false}
        inline
        label={
          <span className='inline-flex cursor-pointer justify-center rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-white'>
            <span className='sr-only'>{t('fileSettings')}</span>
            <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
              <path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z' />
            </svg>
          </span>
        }
      >
        {file.status === 'uploaded' && (
          <Dropdown.Item onClick={() => handleDownloadOnClick(file)}>
            <a href='#' className='w-full flex items-center text-sm py-2 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white'>
              <HiDownload className='text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white' />{' '}
              <span className='ml-3'>{t('download')}</span>
            </a>
          </Dropdown.Item>
        )}
        <Dropdown.Item onClick={() => setShowEditNameModal(true)}>
          <a
            href='#'
            className='w-full flex items-center text-sm py-2 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white border-b border-gray-200 dark:border-gray-600'
          >
            <HiOutlinePencilAlt className='text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white' />{' '}
            <span className='ml-3'>{t('edit')}</span>
          </a>
        </Dropdown.Item>
        {/*<Dropdown.Item className='hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white border-b border-gray-200 dark:border-gray-600'>*/}
        {/*  <a href='#' className='w-full flex items-center text-sm py-2 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white'>*/}
        {/*    {' '}*/}
        {/*    <HiShare className='text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white' />{' '}*/}
        {/*    <span className='ml-3'>W3XShare</span>*/}
        {/*  </a>*/}
        {/*</Dropdown.Item>*/}
        <Dropdown.Item className='hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white' onClick={onDelete}>
          <a href='#' className='w-full flex items-center text-sm py-2 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white'>
            {' '}
            <HiTrash className='text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white' />
            <span className='ml-3'>{t('delete')}</span>
          </a>
        </Dropdown.Item>
      </Dropdown>
      <EditNameModal show={showEditNameModal} onClose={handleOnClose} name={file.name} type={file.type} />
    </>
  )
}

export default FileSettingsDropdown
