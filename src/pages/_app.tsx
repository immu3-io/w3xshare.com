import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { goerli, polygon } from 'wagmi/chains'
import 'react-toastify/dist/ReactToastify.css'

const chains = [goerli, polygon]
const { provider, webSocketProvider } = configureChains(chains, [w3mProvider({ projectId: process.env.WALLET_CONNECT_PROJECT_ID })])
const client = createClient({
  connectors: w3mConnectors({
    chains,
    version: 2,
    projectId: process.env.WALLET_CONNECT_PROJECT_ID
  }),
  provider,
  webSocketProvider
})
const ethereumClient = new EthereumClient(client, chains)

function MyApp({ Component, pageProps }) {
  const [showChild, setShowChild] = useState<boolean>(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) return null
  if (typeof window === 'undefined') return <></>

  return (
    <>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
        <ToastContainer />
      </WagmiConfig>
      <Web3Modal projectId={process.env.WALLET_CONNECT_PROJECT_ID} ethereumClient={ethereumClient} />
    </>
  )
}

export default MyApp
