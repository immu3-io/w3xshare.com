import Box from '@mui/material/Box'
import { FC } from 'react'
import { Backdrop } from '@mui/material'
import { Spinner } from 'flowbite-react'
import { HiCheckCircle } from 'react-icons/hi'

interface ISyncBackdropProps {
  open: boolean
  currentStep: string
  history: string[]
}

const SyncBackdropSteps: FC<ISyncBackdropProps> = ({ open, currentStep, history }) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
      <Box sx={{ width: '300px' }}>
        <ul className='space-y-2 font-medium text-left'>
          {history.slice(0, -1).map((step, index) => (
            <li key={index} className='flex items-center text-gray-900 rounded-lg dark:text-white'>
              <HiCheckCircle className='text-2xl text-gray-500 dark:text-pollinationx-honey' />
              <span className='ml-3'>{step}</span>
            </li>
          ))}
          <li>
            <Spinner className='mr-3' />
            {currentStep}
          </li>
        </ul>
      </Box>
    </Backdrop>
  )
}

export default SyncBackdropSteps
