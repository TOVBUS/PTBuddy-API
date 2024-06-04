const express = require('express');
const { User } = require('../models/index');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const createHash = async (password, saltRound) => {
  let hashed = await bcrypt.hash(password, saltRound);
  console.log(hashed);
  return hashed;
};

const upload = require('./uploadImage');
router.post('/sign-up', upload.single('profile'));

router.post('/sign-up', async (req, res) => {
  const member = req.body;
  member.profile = req.filename;
  const newPassword = await createHash(member.password, 10);
  console.log(newPassword);
  member.password = newPassword;
  try {
    const result = await User.create(member);
    res.json({ success: true, member: result, message: '멤버 추가 성공' });
  } catch (err) {
    res.json({ success: false, member: [], message: err.message });
  }
});

router.post('/sign-in', async (req, res) => {
  const { userName, password } = req.body;
  const options = {
    attributes: ['password', 'userName', 'profile', 'id'],
    where: { userName: userName },
  };
  const result = await User.findOne(options);
  if (result) {
    const compared = await bcrypt.compare(password, result.password);
    if (compared) {
      const token = jwt.sign({ uid: result.id, rol: 'admin' }, secret);
      res.json({
        success: true,
        token: token,
        member: {
          userName,
          profile: result.profile,
          userName: result.userName,
        },
        message: '로그인에 성공했습니다.',
      });
    } else {
      res.json({ success: false, token: '', message: '비번이 틀렸습니다.' });
    }
  } else {
    res.json({
      success: false,
      token: '',
      message: '존재하지않는 아이디입니다.',
    });
  }
});

module.exports = router;
