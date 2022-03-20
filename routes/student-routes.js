const express = require('express');
const {addStudent, 
      getAllStudents, 
      getStudent, 
      updateStudent,
      getStudentByEmail} 
      = require('../controllers/studentController');

const router = express.Router();

router.post('/student', addStudent);
router.get('/student', getAllStudents);
router.get('/student/:id', getStudent);
router.put('/student/:id', updateStudent);
router.get('/student/email/:emailId', getStudentByEmail);

module.exports = {
    routes: router
}
