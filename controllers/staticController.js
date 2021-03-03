'use strict';
const path = require('path');
const pug = require('pug');

const getMemberPage = async(req, res, next) => {
    try {
        res.sendFile(path.join(__dirname+'/../static/member.html'));
    } catch(error) {
        res.status(404).send(error.message);
    }
}

const getAdminPage = async(req, res, next) => {
    try {
        let members = [
            {name: 'Sophia M', email: 'sd@gmail.com', hours: 2},
            {name: 'Cathy Wu', email: 'cathywu@gmail.com', hours: 3},
            {name: 'Swetha P', email: 'swpuvvad@gmail.com', hours: 6}
        ];

        let requests = [
                {dateRequested: '2020-10-20', name: 'Sophia D', hours: 8, isAccepted: 'A'},
                {dateRequested: '2020-11-05', name: 'Swetha P', hours: 5, isAccepted: 'D'},
                {dateRequested: '2020-11-21', name: 'Cathy W', hours: 3, isAccepted: 'D'},
                {dateRequested: '2020-12-20', name: 'Swetha P', hours: 6, isAccepted: 'A'}
            ];
        res.render('admin', {FullName: 'Swetha', Email: 'swpuvvada@gmail.com', Title: 'President', members: members, requests: requests});
        // res.sendFile(path.join(__dirname+'/../static/admin.html'));
    } catch(error) {
        res.status(404).send(error.message);
    }
}

module.exports = {
    getMemberPage,
    getAdminPage
}