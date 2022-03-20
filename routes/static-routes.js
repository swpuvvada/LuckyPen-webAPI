const express = require('express');
const {getAdminPage,
      getStudentPage,
      getSignInPage,
      getRegisterPage,
      loginUser
      } = require('../controllers/staticController');

const router = express.Router();

router.get('/student/:id', getStudentPage);
router.get('/admin/:id', getAdminPage);
router.get('/', getSignInPage);
router.post('/login', loginUser);
router.get('/register', getRegisterPage);

module.exports = {
    routes: router
}