'use strict';

const firebase = require('../db');
const Member = require('../models/member');
const Volunteer = require('../models/volunteer');
const VolunteerRequest = require('../models/volunteerRequest');
const { updateMemberData } = require('./memberController');
const firestore = firebase.firestore();

// to send volunteer hour request (for members)
const addVolunteerHour = async (req, res, next) => {
    try {
        const data = req.body;
        data.isAccepted = null;
        await firestore.collection('volunteerHours').doc().set(data);
        res.status(200).send({message: 'Request saved successfully'});
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const getHours = async(req, res, next) => {
    let hours = [];
    try {
        const data = await firestore.collection('volunteerHours').get();
        if (!data.empty) {
            data.forEach(doc => {
                const hour = new Volunteer(
                    doc.id,
                    doc.data().emailId,
                    doc.data().dateRequested,
                    doc.data().dateReviewed,
                    doc.data().hoursRequested,
                    doc.data().isAccepted,
                    doc.data().reviewedBy
                );
                hours.push(hour);
            })
        }
        res.send(hours);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// get all volunteer hour history (for members)
const getHoursRecordByEmail = async (req, res, next) => {
    try{
        let volunteerArray = await getHoursRecordbyEmailInternal();
        res.sent(volunteerArray);
    } catch (error) {
        res.status(400).send(error.message);
    }

}

const getHoursRecordbyEmailInternal = async (emailId) => {
    let hours = [];
    try{
        await firestore.collection('volunteerHours').where('emailId', '==', emailId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const hour = new Volunteer(
                        doc.id,
                        doc.data().emailId,
                        doc.data().dateRequested,
                        doc.data().dateReviewed,
                        doc.data().hoursRequested,
                        doc.data().isAccepted,
                        doc.data().reviewedBy
                    );
                    hours.push(hour);
                });
        })
        .catch((error) => {
            console.log(error.message);
        });
    } catch (error) {
        console.log(error.message);
    }
    return hours;
}


// Accept/Deny volunteer hour request (used by Admin)
const updateHoursRecord = async (req, res, next) => {
    try{
        let totalHoursToUpdate = {};
        let adminEmail = req.body.adminEmail;
        let reviewedHours = req.body.reviewedHours;
        for (let idx in reviewedHours) {
            let data = reviewedHours[idx];
            let documentId = data.id;
            data.reviewedBy = adminEmail;
            data.dateReviewed = getCurrentDate();
            if (data.isAccepted == 'A') {
                let emailId = data.emailId;
                if (emailId in totalHoursToUpdate) {
                    totalHoursToUpdate[emailId] += parseInt(data.hoursRequested)
                } else {
                    totalHoursToUpdate[emailId] = parseInt(data.hoursRequested);
                }
            }
            await firestore.collection('volunteerHours').doc(documentId).update(data);
        }

        await updateMemberData(totalHoursToUpdate);
        res.status(200).send({message: 'Volunteer Hour record updated successfuly'});
    }catch (error){
        res.status(400).send({error: error.message});
    }
}

const getCurrentDate = () =>{
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    var currentDate = year + '-' + month + '-' + date;
    return currentDate;
}

// get Volunteer hours that need to reviewed (used by Admin)
const getHoursToBeReviewed = async (req, res, next) => {
    try{
        let volunteerRequestArray = await getHoursToBeReveiwedInternal();
        res.send(volunteerRequestArray);
    }catch (error) {
        res.status(400).send(error.message);
    }
}
//gets all volunteer hour requests that aren't reveiwed yet to the Admin page to be approved
const getHoursToBeReveiwedInternal = async () => {
    let hours = [];
    try{
        await firestore.collection('volunteerHours').where("isAccepted", '==', null)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const hour = new VolunteerRequest(
                        doc.id,
                        doc.data().emailId,
                        doc.data().dateRequested,
                        doc.data().hoursRequested,
                        doc.data().isAccepted,
                        doc.data().reviewedBy
                    );
                    hours.push(hour);
                });
            })
            .catch((error) => {
                res.status(400).send(error.message);
            });
    } catch (error) {
        console.log(error.massage);
    }
    return hours;
}
//gets all reveiwed hours request information for table on Admin page
const getHoursReveiwedInternal = async () => {
    let hours = [];
    try{
        await firestore.collection('volunteerHours').where("isAccepted", '!=', null)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const hour = new VolunteerRequest(
                        doc.id,
                        doc.data().emailId,
                        doc.data().dateRequested,
                        doc.data().hoursRequested,
                        doc.data().isAccepted,
                        doc.data().reviewedBy
                    );
                    hours.push(hour);
                });
            })
            .catch((error) => {
                res.status(400).send(error.message);
            });
    } catch (error) {
        console.log(error.massage);
    }
    return hours;
}

module.exports = {
    addVolunteerHour,
    getHoursRecordByEmail,
    updateHoursRecord,
    getHoursToBeReviewed,
    getHoursRecordbyEmailInternal,
    getHoursToBeReveiwedInternal,
    getHoursReveiwedInternal,
    getHours
}