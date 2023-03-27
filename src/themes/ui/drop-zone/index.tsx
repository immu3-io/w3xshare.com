import React, { useEffect, useMemo, useState } from 'react'
import { DropzoneInputProps, useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { formatBytes } from '../../../utils'
import * as _ from 'lodash'

interface IDropzoneProps extends DropzoneInputProps {
  uploadedFiles?: any[]
  onDropFiles?: any
  onChangeFiles?: any
  hideUpload?: boolean
}

const Dropzone: React.FC<IDropzoneProps> = ({ multiple, uploadedFiles, onDropFiles, onChangeFiles, hideUpload = false }) => {
  const [files, setFiles] = useState<any[]>([])
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, isDragActive } = useDropzone({
    onDrop: async acceptedFiles => {
      setFiles(acceptedFiles)
      onDropFiles(acceptedFiles)
    },
    multiple: !!multiple
  })

  const handleOnRemove = index => {
    files.splice(index, 1)

    setFiles(_.cloneDeep(files))
    onChangeFiles(_.cloneDeep(files))
  }

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  )

  const thumbs = files.map((file, index: number) => (
    <div key={file.name} style={thumbsContainer}>
      <div style={{ ...thumbIcon }}>
        <FontAwesomeIcon icon={faFile} onClick={() => handleOnRemove(index)} />
      </div>
      <div style={thumbTitle}>
        {file.name} ({formatBytes(file.size)})
      </div>
      <div style={thumbIconWrapper}>
        <FontAwesomeIcon icon={faXmark} onClick={() => handleOnRemove(index)} />
      </div>
    </div>
  ))

  useEffect(() => {
    setFiles(uploadedFiles)
  }, [uploadedFiles])

  return (
    <>
      <div style={{ height: 212 }}>
        {!hideUpload && (
          <div className='dropArea' {...getRootProps({ style })}>
            <div className='mb-24'>DROP THE LOAD</div>
            <input {...getInputProps()} />
            <img src='/img/dropzone/dropzone.png' alt='' width={80} />
            <div className='mt-24'>{isDragActive ? 'Drop the files here ...' : "the only drop you'll ever like"}</div>
          </div>
        )}
      </div>
      <div>
        <aside>{thumbs}</aside>
      </div>
    </>
  )
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 20,
  color: '#2980b9',
  outline: 'none',
  transition: 'border .24s ease-in-out'
}

const focusedStyle = {
  borderColor: '#2196f3'
}

const acceptStyle = {
  borderColor: '#2980b9'
}

const rejectStyle = {
  borderColor: '#ff1744'
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

export default Dropzone
