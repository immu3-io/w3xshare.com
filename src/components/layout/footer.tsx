import Link from 'next/link'
import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <footer id='footer'>
      <div className='w3xshare_fn_footer'>
        <div className='footer_bottom'>
          <div className='container'>
            <div className='fb_in'>
              <div className='fb_left'>
                <Link href='https://twitter.com/w3xshare'>
                  <a target='_blank' rel='noreferrer noopener'>
                    <FontAwesomeIcon icon={faTwitter} className='fg-white mr-16' />
                  </a>
                </Link>
              </div>
              <div className='fb_right'>
                <ul>
                  <li> <a target="_blank" href="https://sepolia-faucet.pk910.de/">Live Beta on Sepolia Testnet | <u>Get Some Testnet Tokens</u></a> </li>
                  <li>
                    <a target='_blank' href='https://wiki.w3xshare.com/' rel='noreferrer noopener'>
                      Wiki
                    </a>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCopyright} className='fg-white mr-8' /> {moment().format('YYYY')} W3XShare
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
