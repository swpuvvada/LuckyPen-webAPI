'use strict';
const path = require('path');
const {getAllStudentsInternal, getStudentByEmailInternal, getStudentInternal} = require('./studentController');
const {getSessionsByEmailInternal, getPaidSessionsInternal, getUnPaidSessionsInternal, getActiveSessions, getUnApprovedSessions} = require('./sessionController');

const getStudentPage = async(req, res, next) => {
    try {
        let user = await getUser(req.params.id);
        if (user == null) {
            res.send({url: '/'});
        }

        let scheduledSessions = await getSessionsByEmailInternal(user.email);
        let completedSessions = await getSessionsByEmailInternal(user.email);
        res.render('student', 
                {
                    FullName: user.name, 
                    Email: user.email,
                    studentId: req.params.id,
                    // TotalHours: 'Hours: ' + user.totalHours,
                    scheduledSessions: scheduledSessions,
                    completedSessions: completedSessions

                });
    } catch(error) {
        res.status(404).send(error.message);
    }
}

const getAdminPage = async(req, res, next) => {
    try {
        let user = await getUser(req.params.id);
        if (user == null) {
            res.send({url: '/'});
        }
        
        let students = await getAllStudentsInternal();
        let activeSessions = await getActiveSessions();
        let unApprovedSessions = await getUnApprovedSessions();
        let paidSessions = await getPaidSessionsInternal();
        let unpaidSessions = await getUnPaidSessionsInternal();
        res.render('admin', 
                { 
                    FullName: user.name, 
                    Email: user.email,
                    Title: 'President', 
                    students: students, 
                    paidSessions: paidSessions, 
                    unpaidSessions: unpaidSessions
                });
    } catch(error) {
        res.status(404).send(error.message);
    }
}
const getSignInPage = async(req, res, next) => {
    try {
        res.render('sign-in');
    } catch(error) {
        res.status(404).send(error.message);
    }
}

const getRegisterPage = async(req, res, next) => {
    try {
        res.render('register');
    } catch(error) {
        res.status(404).send(error.message);
    }
}

const loginUser = async (req, res, next) => {
    try {
        let body = req.body;
        let emailId = body.emailId;
        let password = body.password;
        let user = await getStudentByEmailInternal(emailId);
        let redirect_url = '/';
        
        if (user == null || password != user.password) {
            console.log("User doesn't exist or incorrect password");
            // student doesn't exist or invalid password
        } else if (user.isAdmin == true) { // if user is admin redirect to admin page
            redirect_url = '/admin/' + user.id;
        } else {
            redirect_url = '/student/' + user.id; // redirect to student page
        }
        res.send({url: redirect_url});
    } catch (error) {
        console.log(error.message);
        res.status(404).send(error.message);
    }
}

async function getUser(id) {
    let validUser = false;
    let user = null;
    if (id != null) {
        user = await getStudentInternal(id);
    }
    return user;
}

module.exports = {
    getStudentPage,
    getAdminPage,
    getSignInPage,
    loginUser,
    getRegisterPage
}