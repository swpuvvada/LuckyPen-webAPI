'use strict';

const firebase = require('../db');
const Member = require('../models/member');
const firestore = firebase.firestore();

const addMember = async(req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('members').doc().set(data);
        res.send('Record saved successfully');
    } catch(error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addMember
}