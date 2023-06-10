import { TStatus, TType } from '@/types'

export interface IFile {
  id: string
  image?: string
  hash?: string
  name: string
  type: TType
  status: TStatus
  uploaded?: boolean
  url?: string
  createdAt?: string
  size?: number
  children?: IFile[]
  file?: File
}

export interface INftPackage {
  id: number
  size: number
  price: number
  disabled: boolean
  processing: boolean
  done: boolean
}
