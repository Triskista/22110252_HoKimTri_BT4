const { createUserService, loginService, getUserService, generateResetToken, resetPassword } = require('../services/userService');
const { sendResetPasswordEmail } = require('../services/mailService');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  return res.status(200).json(data)
}

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);

  return res.status(200).json(data)
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const data = await generateResetToken(email);
  if (data && data.EC === 0) {
    const token = data.data?.resetToken;
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontend}/reset-password/${token}`;
    try {
      await sendResetPasswordEmail(email, resetLink);
      return res.status(200).json({ EC: 0, EM: 'Email đặt lại mật khẩu đã được gửi' });
    } catch (err) {
      console.log('Error sending reset email', err);
      // still return success for security, but log the error
      return res.status(200).json({ EC: 0, EM: 'Yêu cầu nhận được — nhưng chưa gửi được email (kiểm tra console)' , data: { resetLink }});
    }
  }
  return res.status(200).json(data)
}

const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;
  const data = await resetPassword(token, password);
  return res.status(200).json(data)
}

const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data)
}

const getAccount = async (req, res) => {

  return res.status(200).json(req.user)
}

module.exports = {
  createUser, handleLogin, getUser, getAccount,
  forgotPassword, resetPasswordController
}
