const express = require('express');
const {getAdminPage,
      getMemberPage,
      getSignInPage,
      loginUser
      } = require('../controllers/staticController');

const router = express.Router();

router.get('/member', getMemberPage);
router.get('/admin', getAdminPage);
router.get('/', getSignInPage);
router.post('/login', loginUser);

module.exports = {
    routes: router
}