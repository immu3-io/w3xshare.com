import axios from 'axios'
import nodemailer from 'nodemailer'
import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment/moment'

const mailConfig = {
  host: 'mail.datavallis.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_GMAIL_USER,
    pass: process.env.NEXT_PUBLIC_GMAIL_PASS
  }
}

const getTemplate = async (file: string): Promise<any> => (await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}${file}`)).data

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const template = await getTemplate('/templates/emails/template.html')
  const currentTime = moment().format('DD MMM YYYY hh:mm A')
  const sendHtml = template
    .replace('%EMAIL%', req.body.email)
    .replace('%ACCOUNT%', req.body.recipientAccount)
    .replace('%TITLE%', req.body.title)
    .replace('%MESSAGE%', req.body.message)
    .replace('%SENDER_WALLET%', req.body.senderWallet)
  // .replace('%FILES%', req.body.files)

  await nodemailer
    .createTransport(mailConfig)
    .sendMail({
      from: 'W3XShare <' + process.env.NEXT_PUBLIC_GMAIL_USER + '>',
      to: req.body.recipientEmail,
      replyTo: req.body.email,
      subject: req.body.senderWallet + ' sent you files at [' + currentTime + ']',
      html: sendHtml
    })
    .then(() => {
      res.status(200).end()
    })
    .catch(error => res.status(500).send(error))
}

export default handler
