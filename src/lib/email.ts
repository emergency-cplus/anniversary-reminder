import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendReminderEmailParams {
  to: string;
  title: string;
  category: 'birthday' | 'anniversary';
  daysUntil: number;
  date: string;
}

export async function sendReminderEmail({
  to,
  title,
  category,
  daysUntil,
  date,
}: SendReminderEmailParams) {
  const isBirthday = category === 'birthday';
  const emoji = isBirthday ? '🎂' : '🎉';
  const categoryLabel = isBirthday ? '誕生日' : '記念日';

  const timingLabel =
    daysUntil === 0
      ? '今日'
      : daysUntil === 1
      ? '明日'
      : `${daysUntil}日後`;

  const subject = `${emoji} ${timingLabel}は${title}です`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="margin:0; padding:0; background-color:#fefdfb; font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:480px; margin:0 auto; padding:40px 24px;">
        <!-- Header -->
        <div style="text-align:center; margin-bottom:32px;">
          <div style="font-size:48px; margin-bottom:12px;">${emoji}</div>
          <h1 style="font-size:20px; font-weight:700; color:#2a2520; margin:0;">
            ${timingLabel}は${title}です
          </h1>
        </div>

        <!-- Card -->
        <div style="background:#ffffff; border:1px solid #f0ece6; border-radius:16px; padding:24px; margin-bottom:24px;">
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0; color:#8a8279; font-size:14px;">記念日</td>
              <td style="padding:8px 0; text-align:right; font-weight:600; color:#2a2520; font-size:14px;">${title}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#8a8279; font-size:14px;">カテゴリ</td>
              <td style="padding:8px 0; text-align:right; font-weight:600; color:#2a2520; font-size:14px;">${categoryLabel}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#8a8279; font-size:14px;">日付</td>
              <td style="padding:8px 0; text-align:right; font-weight:600; color:#2a2520; font-size:14px;">${date}</td>
            </tr>
          </table>
        </div>

        <!-- Message -->
        <div style="text-align:center; padding:16px 0;">
          <p style="font-size:16px; font-weight:600; color:#d97706; margin:0 0 8px 0;">
            人を幸せにするチャンスです 🎁
          </p>
          <p style="font-size:13px; color:#8a8279; margin:0;">
            お祝いの準備はできていますか？<br>
            心のこもったメッセージやプレゼントで、大切な人を笑顔にしましょう。
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align:center; margin-top:32px; padding-top:16px; border-top:1px solid #f0ece6;">
          <p style="font-size:11px; color:#b5b0a7; margin:0;">
            Anniversary Reminder からの通知です
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Anniversary Reminder <onboarding@resend.dev>',
    to,
    subject,
    html: htmlContent,
  });

  if (error) {
    console.error('Failed to send email:', error);
    throw error;
  }

  return data;
}
