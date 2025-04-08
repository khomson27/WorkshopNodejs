var express = require('express');
var router = express.Router();
var response = require('../utils/respones');
var User = require('../models/user.model');


/* GET users listing. */
router.get('/', async function(req, res, next) {
  
  let users = await User.find({})

  res.send(users);

});

/* PUT users listing. */
router.put('/:userId/approve', async function(req, res, next) {
  let { userId } = req.params
  
  try {
    let user = await User.findByIdAndUpdate(userId, {isActive: true }, {new: true})
    message="approve สำเร็จ"
    return response.sendResponse(res, 200 , message, user)
  } catch (err) {
    return response.sendResponse(res, 500 , err.message)
  }
})



module.exports = router;
