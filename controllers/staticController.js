'use strict';
const path = require('path');
const {getAllMembersInternal, getMemberByEmailInternal, getMemberInternal} = require('./memberController');
const {getHoursRecordbyEmailInternal, getHoursToBeReveiwedInternal, getHoursReveiwedInternal, getHoursToBeReviewed} = require('./volunteerHoursController');

const getMemberPage = async(req, res, next) => {
    try {
        let user = await getUser(req.params.id);
        if (user == null) {
            res.send({url: '/'});
        }

        let requestHistory= await getHoursRecordbyEmailInternal(user.email);
        res.render('member', 
                {
                    FullName: user.name, 
                    Email: user.email,
                    // MemberId: req.params.id,
                    TotalHours: 'Hours: ' + user.totalHours,
                    requestHistory: requestHistory
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
        
        let members = await getAllMembersInternal();
        let requestHistory = await getHoursReveiwedInternal();
        let requestPending = await getHoursToBeReveiwedInternal();
        res.render('admin', 
                { 
                    FullName: user.name, 
                    Email: user.email,
                    Title: 'President', 
                    members: members, 
                    requestHistory: requestHistory, 
                    requestPending: requestPending
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

const loginUser = async (req, res, next) => {
    try {
        let body = req.body;
        let emailId = body.emailId;
        let password = body.password;
        let user = await getMemberByEmailInternal(emailId);
        let redirect_url = '/';
        
        if (user == null || password != user.password) {
            console.log("User doesn't exist or incorrect password");
            // member doesn't exist or invalid password
        } else if (user.isAdmin == true) { // if user is admin redirect to admin page
            redirect_url = '/admin/' + user.id;
        } else {
            redirect_url = '/member/' + user.id; // redirect to member page
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
        user = await getMemberInternal(id);
    }
    return user;
}

module.exports = {
    getMemberPage,
    getAdminPage,
    getSignInPage,
    loginUser
}