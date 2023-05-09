import React, { useEffect, useMemo, useState } from 'react'
import { DropzoneInputProps, useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { formatBytes } from '../../../utils'
import * as _ from 'lodash'
import {notify} from "../../../utils/notify";

interface IDropzoneProps extends DropzoneInputProps {
  uploadedFiles?: any[]
  onDropFiles?: any
  onChangeFiles?: any
  hideUpload?: boolean
}

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB in bytes

const Dropzone: React.FC<IDropzoneProps> = ({ multiple, uploadedFiles, onDropFiles, onChangeFiles, hideUpload = false }) => {
  const [files, setFiles] = useState<any[]>([])
  const [totalSize, setTotalSize] = useState(0);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, isDragActive } = useDropzone({
    onDrop: async acceptedFiles => {
      let size = totalSize;
      const updatedFiles = files;
      acceptedFiles.forEach(file => {
        if (size + file.size <= MAX_SIZE) {
          updatedFiles.push(file)
          size += file.size
        }
        else{
          notify(`File "${file.name}" is too large (Max ${MAX_SIZE / (1024 * 1024)} MB)`, 'error')
        }
      });

    if(updatedFiles.length > 0){
      setFiles(updatedFiles)
      onDropFiles(updatedFiles)
      setTotalSize(size)
    }
    else{
      notify(`File is too large`, 'error')
    }


    },
    multiple: !!multiple,
    maxSize: MAX_SIZE
  })
  const handleOnRemove = index => {
    files.splice(index, 1)
    setFiles(_.cloneDeep(files))
    onChangeFiles(_.cloneDeep(files))
    const size = _.cloneDeep(files).reduce((total, file) => total + file.size, 0)
    setTotalSize(size)

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
            <div className='mb-24'>DROP THE LOAD (Up to {MAX_SIZE / (1024 * 1024)} MB)</div>
            <input {...getInputProps()} />
            <img src='/img/dropzone/dropzone.png' alt='' width={80} />
            <div className='mt-24'>{isDragActive ? 'Drop the files here ...' : "the only drop you'll ever like"}</div>
            {totalSize > 0 && <p>Total size of dropped files: {(totalSize / (1024 * 1024)).toFixed(2)} MB</p>}
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
