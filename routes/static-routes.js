const express = require('express');
const {getAdminPage,
      getMemberPage,
      getSignInPage
      } = require('../controllers/staticController');

const router = express.Router();

router.get('/member', getMemberPage);
router.get('/admin', getAdminPage);
router.get('/', getSignInPage);

module.exports = {
    routes: router
}
