const express = require('express');
const {getAdminPage,
      getMemberPage
      } = require('../controllers/staticController');

const router = express.Router();

router.get('/member', getMemberPage);
router.get('/admin', getAdminPage);

module.exports = {
    routes: router
}
