const express = require('express');
const {getAdminPage,
      getMemberPage,
      getSignInPage,
      getRegisterPage,
      loginUser
      } = require('../controllers/staticController');

const router = express.Router();

router.get('/member/:id', getMemberPage);
router.get('/admin/:id', getAdminPage);
router.get('/', getSignInPage);
router.post('/login', loginUser);
router.get('/register', getRegisterPage);

module.exports = {
    routes: router
}