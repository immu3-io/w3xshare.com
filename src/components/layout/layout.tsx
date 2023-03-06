import Head from 'next/head'
import Footer from './footer'
import Header from './header'
import React, { Fragment, useEffect } from 'react'
import { animationText, dataBgImg } from '../../utils'

interface ILayoutProps {
  children: React.ReactNode
  pageName: string
}

const Layout: React.FC<ILayoutProps> = ({ children, pageName }) => {
  useEffect(() => {
    animationText()
    dataBgImg()
  }, [])

  return (
    <Fragment>
      <Head>
        <title>{pageName}</title>
      </Head>
      <div className='w3xshare_fn_main'>
        <Header />
        <div className='w3xshare_fn_content'>{children}</div>
        <Footer />
      </div>
      <div className='w3xshare_fn_moving_box'></div>
    </Fragment>
  )
}
export default Layout
