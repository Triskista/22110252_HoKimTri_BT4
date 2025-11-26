require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const crypto = require('crypto');

const createUserService = async (name, email, password) => {
  try {
    //check user exist
    const user = await User.findOne({ email: email });
    if (user) {
      console.log(`>>> user exist, chon 1 email khác: ${email}`);
      return null;
    }

    //hash user password
    const hashPassword = await bcrypt.hash(password, saltRounds)
    //save user to database
    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "user"
    })
    return result;

  } catch (error) {
    console.log(error);
    return null;
  }
}

const generateResetToken = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return { EC: 1, EM: 'Email không tồn tại' };
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In production, send email with the token link. For dev we return token so frontend can show it or for testing.
    return { EC: 0, EM: 'OK', data: { resetToken: token } };
  } catch (error) {
    console.log(error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
}

const resetPassword = async (token, newPassword) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return { EC: 1, EM: 'Token không hợp lệ hoặc đã hết hạn' };
    }

    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { EC: 0, EM: 'Đặt lại mật khẩu thành công' };
  } catch (error) {
    console.log(error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
}

const loginService = async (email, password) => {
  try {
    //fetch user by email
    const user = await User.findOne({ email: email });
    if (user) {
      //compare password
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (isMatchPassword) {
        //create an access token
        const payload = {
          email: user.email,
          name: user.name,
          role: user.role || 'user',
        }

        const access_token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRE
          }
        );

        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            name: user.name
            , role: user.role || 'user'
          }
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password không hợp lệ"
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getUserService = async () => {
  try {

    let result = await User.find({}).select("-password");
    return result;

  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  createUserService, loginService, getUserService,
  generateResetToken, resetPassword
}
