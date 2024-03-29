import nodemailer from 'nodemailer'
import moment from 'moment/moment'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

const mailConfig = {
  host: process.env.NEXT_PUBLIC_MAIL_HOST,
  port: process.env.NEXT_PUBLIC_MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_MAIL_USER,
    pass: process.env.NEXT_PUBLIC_MAIL_PASS
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const template = (await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/templates/emails/template.html`)).data
  const currentTime = moment().format('DD MMM YYYY hh:mm A')
  const sendHtml = template
    .replaceAll('%HASH%', req.body.hash)
    .replaceAll('%EMAIL%', req.body.senderEmail)
    .replaceAll('%ACCOUNT%', req.body.recipientWallet)
    .replaceAll('%TITLE%', req.body.title)
    .replaceAll('%MESSAGE%', req.body.message)
    .replaceAll('%SENDER_WALLET%', req.body.senderWallet)
    .replaceAll('%BASE_URL%', process.env.NEXT_PUBLIC_BASE_URL)
    .replaceAll('%secret%', req.body.secret ? '&s=' + req.body.secret : '')
  // .replace('%FILES%', req.body.files)
  await nodemailer
    .createTransport(mailConfig)
    .sendMail({
      from: 'W3XShare <' + process.env.NEXT_PUBLIC_MAIL_USER + '>',
      to: req.body.recipientEmail,
      replyTo: req.body.senderEmail,
      subject: req.body.senderWallet + ' sent you files at [' + currentTime + ']',
      html: sendHtml
    })
    .then(() => {
      res.status(200).end()
    })
    .catch(error => res.status(500).send(error))
}

export default handler
