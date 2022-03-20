const express = require('express');

const {addSession,
       getSessionsByEmail,
       updateSessionsRecord,
       getUnPaidSessions,
       getSessions} 
       = require('../controllers/sessionController');

const router = express.Router();

router.post('/session', addSession);
router.get('/session/:emailId', getSessionsByEmail);
router.put('/session', updateSessionsRecord);
router.get('/session?unpaid', getUnPaidSessions);
router.get('/session', getSessions);

module.exports = {
    routes: router
}
