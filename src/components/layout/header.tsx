import React, { Fragment, useCallback, useEffect, useState } from 'react'
import Transfer from '../transfer'
import Files from '../files'
import ConnectWalletDialog from '../../themes/components/feedback/connect-wallet.dialog'
import { useAccount } from 'wagmi'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import { Web3Button } from '@web3modal/react'
import { fetchSigner, Signer } from '@wagmi/core'

export let signer: Signer

const tabProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`
})

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} style={{ paddingTop: 24 }} {...other}>
      {value === index && (
        <Box>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const Header = () => {
  const [open, setOpen] = useState(false)
  const [toggle, setToggle] = useState<boolean>(false)
  const [tabIndex, setTabIndex] = useState<number>(0)
  const { address, isConnected } = useAccount()

  const handleChange = (event: React.SyntheticEvent, index: number) => {
    !event || setTabIndex(index)
  }

  const handleSigner = useCallback(async () => {
    signer = isConnected ? await fetchSigner() : undefined
  }, [isConnected])

  useEffect(() => {
    handleSigner()
    isConnected || setOpen(false)
  }, [isConnected, address])

  return (
    <Fragment>
      <div className={`nav_overlay ${toggle ? 'go' : ''}`} onClick={() => setToggle(false)} />
      <div className={`w3xshare_fn_nav ${toggle ? 'go' : ''}`}>
        <div className='trigger is-active'>
          <div className='trigger_in' style={{ width: '50%', float: 'left' }}>
            {isConnected ? (
              <Web3Button />
            ) : (
              <>
                <Button variant='outlined' onClick={() => setOpen(true)}>
                  Connect Wallet
                </Button>
                <ConnectWalletDialog open={open} onClose={() => setOpen(false)} />
              </>
            )}
          </div>
          <div className='trigger_in' style={{ width: '50%', float: 'right', marginTop: 22 }} onClick={() => setToggle(false)}>
            <span className='text nav_close_text'>Close</span>
            <span className='hamb'>
              <span className='hamb_a' />
              <span className='hamb_b' />
              <span className='hamb_c' />
            </span>
          </div>
        </div>
        <div className='nav_content'>
          <div className='nav_menu'>
            {isConnected && (
              <div>
                <Box>
                  <Tabs value={tabIndex} onChange={handleChange} aria-label='tabs'>
                    <Tab label='Transfer' {...tabProps(0)} style={{ color: '#1976d2' }} />
                    <Tab label='Received Files' {...tabProps(1)} style={{ color: '#1976d2' }} />
                  </Tabs>
                </Box>
                <TabPanel value={tabIndex} index={0}>
                  <Transfer address={address} />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <Files address={address} />
                </TabPanel>
              </div>
            )}
          </div>
        </div>
      </div>
      <header className='w3xshare_fn_header'>
        <div className='container'>
          <div className='header_in'>
            <div className='logo'>
              <span className='font-bold'>
                <img alt='W3XShare Logo' width='180' src='/img/w3xshare_logo_white_landscape.svg' />
              </span>
            </div>
            <div className='trigger'>
              <div className='trigger_in' onClick={() => setToggle(!toggle)}>
                <span className='text'>Send / receive your files</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  )
}

export default Header
