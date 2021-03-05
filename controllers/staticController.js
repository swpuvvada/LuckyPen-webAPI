'use strict';
const path = require('path');
const {getAllMembersInternal} = require('./memberController');
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

module.exports = {
    getMemberPage,
    getAdminPage,
    getSignInPage
}