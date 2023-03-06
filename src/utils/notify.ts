import { toast, TypeOptions } from 'react-toastify'
import { ToastOptions } from 'react-toastify/dist/types'

export const notify = (message: string, type: TypeOptions = 'success', options?: ToastOptions) =>
  toast(message, {
    ...options,
    type
  })
