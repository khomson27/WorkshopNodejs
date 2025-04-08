var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../models/user.model');
var response = require('../utils/respones');

router.post('/login', async function(req, res, next) {
    const { username, password } = req.body;
    if (!username && !password) {
        message="กรุณากรอก username และ password"
        return response.sendResponse(res, 400 , message)
    }
    if (!username) {
        message="กรุณากรอก username"
        return response.sendResponse(res, 400 , message)
    }
    if (!password) {
        message="กรุณากรอก password"
        return response.sendResponse(res, 400 , message)
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            message=`ไม่พบข้อมูลการลงทะเบียนของ user: ${ username }`
            return response.sendResponse(res, 401 , message)
        }
        if (!user.isActive) {
            message=`user: ${ username } ยังไม่ได้ถูก Approve โดย Admin`
            return response.sendResponse(res, 401 , message)
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            message='password ไม่ถูกต้อง'
            return response.sendResponse(res, 401 , message)
        }else{
            userData = {
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            } 
            const token = jwt.sign( userData , process.env.JWT_SECRET_KEY, { expiresIn: '3h' });
            await User.findByIdAndUpdate(user._id, {accessToken: token }, {new: true});

            message='login สำเร็จ'
            data={
                token: token
            }
            return response.sendResponse(res, 200 , message , data)
        }

    } catch (err) {
        return response.sendResponse(res, 500 , err.message)
    }
})       

router.post('/register', async function(req, res, next) {
  let {firstName , lastName, username, password, role} = req.body
  if (!firstName) {
    message="กรุณากรอก firstname"
    return response.sendResponse(res, 400 , message)
  }
  if (!lastName) {
    message="กรุณากรอก lastName"
    return response.sendResponse(res, 400 , message)
  }
  if (!username) {
    message="กรุณากรอก username"
    return response.sendResponse(res, 400 , message)
  }
  if (!password) {
    message="กรุณากรอก password"
    return response.sendResponse(res, 400 , message)
  }
  if (!role) {
    message="กรุณากรอก role"
    return response.sendResponse(res, 400 , message)
  }
  try {
    let currentUser = await User.findOne({username})
    if (currentUser){
        message=`username: ${username} ถูกใช้ไปแล้ว`
        return response.sendResponse(res, 200 , message) 
    }
    const hashStr = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    const user = await User.create({ firstName, lastName, username, password: hashStr , role, isActive: false ,accessToken: ""});
    message="register สำเร็จ"
    return response.sendResponse(res, 200 , message, user)
  } catch (err) {
    return response.sendResponse(res, 500 , err.message)
  }
})

module.exports = router;