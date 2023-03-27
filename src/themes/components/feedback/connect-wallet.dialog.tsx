import React, { useState } from 'react'
import Link from 'next/link'
import { Checkbox, Dialog, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup } from '@mui/material'
import { Web3Button } from '@web3modal/react'

interface IConnectWalletDialogProps {
  open: boolean
  onClose: () => void
}

const ConnectWalletDialog: React.FC<IConnectWalletDialogProps> = ({ open, onClose }) => {
  const [checked, setChecked] = useState<boolean>(false)

  return (
    <Dialog onClose={onClose} open={open} style={{ zIndex: 9 }}>
      <DialogTitle color='black'>Connect to a wallet</DialogTitle>
      <DialogContent>
        <DialogContentText id='connect-wallet-terms'>
          Accept
          <Link href='https://github.com/immu3-io/static-assets/raw/main/pdf/2023-02-20_CR_Systems_Privacy_Policy.pdf'>
            <a target='_blank' rel='noreferrer noopener' className='mx-4'>
              Privacy Policy
            </a>
          </Link>
          and
          <Link href='https://github.com/immu3-io/static-assets/raw/main/pdf/2023-03-13_CR_Systems_dMail_dChat_w3xshare_Software_Terms.pdf'>
            <a target='_blank' rel='noreferrer noopener' className='mx-4'>
              Software Terms of use
            </a>
          </Link>
          <FormGroup>
            <FormControlLabel control={<Checkbox checked={checked} onClick={(event: any) => setChecked(event.target.checked)} />} label='I read and accepted' />
          </FormGroup>
          {checked && <Web3Button />}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default ConnectWalletDialog
