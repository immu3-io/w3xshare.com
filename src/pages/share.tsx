import Layout from '@/components/layout'
import Main from '@/components/share/main'
import AccountProvider, { useAccountContext } from '@/contexts/account/provider'
import { NextPage } from 'next'

const SharePage: NextPage = () => {
  const { account } = useAccountContext()

  return (
    <div className='h-screen bg-neutral-50 dark:bg-neutral-800'>
      <AccountProvider>
        <Layout children={<Main />} nfts={account?.nfts} />
      </AccountProvider>
    </div>
  )
}

export default SharePage
