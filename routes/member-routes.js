const express = require('express');
const {addMember} = require('../controllers/memberController');

const router = express.Router();

router.post('/member', addMember);

module.exports = {
    routes: router
}
