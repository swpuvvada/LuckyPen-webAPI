const express = require('express');

const {addVolunteerHour,
       getHoursRecordByEmail,
       updateHoursRecord,
       getHoursToBeReviewed} 
       = require('../controllers/volunteerHoursController');

const router = express.Router();

router.post('/request', addVolunteerHour);
router.get('/request/:emailId', getHoursRecordByEmail);
router.put('/request/:id', updateHoursRecord);
router.get('/unapprovedRequests', getHoursToBeReviewed);

module.exports = {
    routes: router
}
