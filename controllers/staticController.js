'use strict';
const path = require('path');
const {getAllMembersInternal, getMemberByEmailInternal} = require('./memberController');
const {getHoursRecordbyEmailInternal, getHoursToBeReveiwedInternal, getHoursReveiwedInternal, getHoursToBeReviewed} = require('./volunteerHoursController');

const getMemberPage = async(req, res, next) => {
    try {
        const emailId = 'xyz@gmail.com';
        let requestHistory= await getHoursRecordbyEmailInternal(emailId);
        res.render('member', 
                {
                    FullName: 'Medha Vadlamudi', 
                    Email: 'medvad@gmail.com', 
                    TotalHours: 'Hours: 14' , 
                    requestHistory: requestHistory
                });
    } catch(error) {
        res.status(404).send(error.message);
    }
}

const getAdminPage = async(req, res, next) => {
    try {
        let members = await getAllMembersInternal();
        let requestHistory = await getHoursReveiwedInternal();
        let requestPending = await getHoursToBeReveiwedInternal();
        res.render('admin', 
                { 
                    FullName: 'Swetha', 
                    Email: 'swpuvvada@gmail.com', 
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
        
        if (user == null || password != user.password) {
            console.log("User doesn't exist or incorrect password");
            // member doesn't exist or invalid password
            // res.render('sign-in');
            res.redirect('/');
            return;
        }
        
        // if user is member redirect to member page
        if (user.isAdmin == true) {
            console.log("Rendering Admin page ...");
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
            return;
        } else {
            console.log("Rendering Member page ...");
            let requestHistory = await getHoursRecordbyEmailInternal(user.email);
            console.log(requestHistory);
            console.log(user);
            res.render('member', 
                {
                    FullName: user.name, 
                    Email: user.email, 
                    TotalHours: 'Hours: ' + user.totalHours, 
                    requestHistory: requestHistory
                });
            return;
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).send(error.message);
    }
}

module.exports = {
    getMemberPage,
    getAdminPage,
    getSignInPage,
    loginUser
}