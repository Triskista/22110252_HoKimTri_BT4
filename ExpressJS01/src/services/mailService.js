require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS
  }
});

const sendResetPasswordEmail = async (to, resetLink) => {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const mailOptions = {
    from: from,
    to,
    subject: 'Yêu cầu đặt lại mật khẩu',
    html: `<p>Xin chào,</p>
      <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn nút bên dưới để đặt lại mật khẩu. Link sẽ hết hạn sau 1 giờ.</p>
      <p><a href="${resetLink}" target="_blank" style="display:inline-block;padding:8px 12px;background:#1890ff;color:#fff;border-radius:4px;text-decoration:none;">Đặt lại mật khẩu</a></p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      <p>Trân trọng.</p>`
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { sendResetPasswordEmail };
