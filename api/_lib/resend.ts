import { Resend } from 'resend'

import { getResendConfig } from './config.js'

const resendConfig = getResendConfig()
const resendClient = new Resend(resendConfig.resendApiKey)

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const subject = '你的 JobTracker 登录验证码'
  const text = `验证码：${otp}\n10 分钟内有效。若非本人操作，请忽略本邮件。`
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111827;">
      <h2 style="margin:0 0 12px;">JobTracker 登录验证码</h2>
      <p style="margin:0 0 8px;">你的验证码是：</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:4px;margin:0 0 12px;">${otp}</p>
      <p style="margin:0 0 8px;color:#6b7280;">10 分钟内有效。若非本人操作，请忽略本邮件。</p>
    </div>
  `

  await resendClient.emails.send({
    from: resendConfig.emailFrom,
    to: email,
    subject,
    text,
    html,
  })
}

