const express = require('express');
const {addMember, 
      getAllMembers, 
      getMember, 
      updateMember,
      getMemberByEmail} 
      = require('../controllers/memberController');

const router = express.Router();

router.post('/member', addMember);
router.get('/member', getAllMembers);
router.get('/member/:id', getMember);
router.put('/member/:id', updateMember);
router.get('/member/email/:emailId', getMemberByEmail);

module.exports = {
    routes: router
}
