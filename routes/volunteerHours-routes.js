const express = require('express');

const {addVolunteerHour,
       getHoursRecordByEmail,
       updateHoursRecord,
       getHoursToBeReviewed,
       getHours} 
       = require('../controllers/volunteerHoursController');

const router = express.Router();

router.post('/request', addVolunteerHour);
router.get('/request/:emailId', getHoursRecordByEmail);
router.put('/request', updateHoursRecord);
router.get('/unapprovedRequests', getHoursToBeReviewed);
router.get('/request', getHours);

module.exports = {
    routes: router
}
