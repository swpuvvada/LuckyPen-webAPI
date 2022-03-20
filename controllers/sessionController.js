'use strict';

const firebase = require('../db');
const SessionRequest = require('../models/sessionRequest');//changed from volunteerRequest
const { updateStudentData } = require('./studentController');
const firestore = firebase.firestore();

// to send volunteer hour request (for students)
const addSession = async (req, res, next) => {
    try {
        const data = req.body;
        data.duration = null;
        data.isPaid = null;
        data.isAccepted = null;
        await firestore.collection('tutorSessions').doc().set(data);
        res.status(200).send({message: 'Request saved successfully'});
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const getSessions = async(req, res, next) => {
    let hours = [];
    try {
        const data = await firestore.collection('tutorSessions').get();
        if (!data.empty) {
            data.forEach(doc => {
                const hour = new SessionRequest(
                    doc.id,
                    doc.data().emailId,
                    doc.data().dateRequested,
                    doc.data().startTime,
                    doc.data().hoursRequested,
                    doc.data().duration,
                    doc.data().isAvailable,
                    doc.data().isAccepted,
                    doc.data().isPaid
                );
                hours.push(hour);
            })
        }
        res.send(hours);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//For Schedule table of Student page
const getScheduledSessions = async(emailId) => {
    let sessions = [];
    try {
        await firestore.collection('tutorSessions').where('emailId', '==', emailId).where("duration", '==', null)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const session = new SessionRequest(
                    doc.id,
                    doc.data().emailId,
                    doc.data().dateRequested,
                    doc.data().startTime,
                    doc.data().hoursRequested,
                    doc.data().duration,
                    doc.data().isAvailable,
                    doc.data().isAccepted,
                    doc.data().isPaid
                );
                sessions.push(session);
            });
        })
        .catch((error) => {
            console.log(error.message);
        });
    } catch (error) {
        console.log(error.message);
    }
    return sessions;
}

//For Payment table on Student page
const getCompletedSessions = async(emailId) => {
    let sessions = [];
    try {
        await firestore.collection('tutorSessions').where('emailId', '==', emailId).where("isAccepted", "==", "A").where("duration", "!=", null)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const session = new SessionRequest(
                    doc.id,
                    doc.data().emailId,
                    doc.data().dateRequested,
                    doc.data().startTime,
                    doc.data().hoursRequested,
                    doc.data().duration,
                    doc.data().isAvailable,
                    doc.data().isAccepted,
                    doc.data().isPaid
                );
                sessions.push(session);
            });
        })
        .catch((error) => {
            console.log(error.message);
        });
    } catch (error) {
        console.log(error.message);
    }
    return sessions;
}

// get all volunteer hour history (for students)
const getSessionsByEmail = async (req, res, next) => {
    try{
        let volunteerArray = await getSessionsByEmailInternal();
        res.sent(volunteerArray);
    } catch (error) {
        res.status(400).send(error.message);
    }

}

const getSessionsByEmailInternal = async (emailId) => {
    let sessions = [];
    try{
        await firestore.collection('tutorSessions').where('emailId', '==', emailId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const hour = new SessionRequest(
                        doc.id,
                        doc.data().emailId,
                        doc.data().dateRequested,
                        doc.data().startTime,
                        doc.data().hoursRequested,
                        doc.data().duration,
                        doc.data().isAvailable,
                        doc.data().isAccepted,
                        doc.data().isPaid
                    );
                    sessions.push(hour);
                });
        })
        .catch((error) => {
            console.log(error.message);
        });
    } catch (error) {
        console.log(error.message);
    }
    return sessions;
}


// TODO: Accept/Deny student hour request (used by Admin) 
const updateSessionsRecord = async (req, res, next) => {
    try{
        // let adminEmail = req.body.adminEmail;
        let reviewedHours = req.body.reviewedHours;
        for (let idx in reviewedHours) {
            let data = reviewedHours[idx];
            let documentId = data.id;
            // data.dateReviewed = getCurrentDate();
            // if (data.isPaid == 'P') {
            //     let emailId = data.emailId;
            //     if (emailId in totalHoursToUpdate) {
            //         totalHoursToUpdate[emailId] += parseInt(data.hoursRequested)
            //     } else {
            //         totalHoursToUpdate[emailId] = parseInt(data.hoursRequested);
            //     }
            // }
            await firestore.collection('tutorSessions').doc(documentId).update(data);
        }

        // await updateStudentData(totalHoursToUpdate);
        res.status(200).send({message: 'Session record updated successfuly'});
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

// get Active Sessions
// Approved & !Paid currentTime<
const getActiveSessions = async () => {
    let sessions = [];
    try{
        await firestore.collection('tutorSessions').where("isPaid", '==', null).where("isAccepted", '==', 'A').where("duration", '==', null)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const hour = new SessionRequest(
                        doc.id,
                        doc.data().emailId,
                        doc.data().dateRequested,
                        doc.data().startTime,
                        doc.data().hoursRequested,
                        doc.data().duration,
                        doc.data().isAvailable,
                        doc.data().isAccepted,
                        doc.data().isPaid
                    );
                    sessions.push(hour);
                });
            })
            .catch((error) => {
                res.status(400).send(error.message);
            });
    } catch (error) {
        console.log(error.massage);
    }
    return sessions;
}

// get UnApproved Sessions
// !Approved currentTime<
const getUnApprovedSessions = async () => {
let sessions = [];
    try{
        await firestore.collection('tutorSessions').where("isAccepted", '==', null)
        .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const hour = new SessionRequest(
                        doc.id,
                        doc.data().emailId,
                        doc.data().dateRequested,
                        doc.data().startTime,
                        doc.data().hoursRequested,
                        doc.data().duration,
                        doc.data().isAvailable,
                        doc.data().isAccepted,
                        doc.data().isPaid
                    );
                    sessions.push(hour);
                });
            })
            .catch((error) => {
                res.status(400).send(error.message);
            });
    } catch (error) {
        console.log(error.massage);
    }
    return sessions;
}

// get unpaid sessions (used by Admin)
const getUnPaidSessions = async (req, res, next) => {
    try{
        let volunteerRequestArray = await getUnPaidSessionsInternal(); //sessionrequest
        res.send(volunteerRequestArray); //sessionrequest
    }catch (error) {
        res.status(400).send(error.message);
    }
}
//gets all unpaid sessions to the Admin page to be approved
const getUnPaidSessionsInternal = async () => {
    let sessions = [];
    try{
        await firestore.collection('tutorSessions').where("duration", '!=', null).where("isPaid", '==', null)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const hour = new SessionRequest(
                        doc.id,
                        doc.data().emailId,
                        doc.data().dateRequested,
                        doc.data().startTime,
                        doc.data().hoursRequested,
                        doc.data().duration,
                        doc.data().isAvailable,
                        doc.data().isAccepted,
                        doc.data().isPaid
                    );
                    sessions.push(hour);
                });
            })
            .catch((error) => {
                console.log(error.message);
            });
    } catch (error) {
        console.log(error.massage);
    }
    return sessions;
}
//get all paid sessions information for table on Admin page
const getPaidSessionsInternal = async () => {
    let hours = [];
    try{
        await firestore.collection('tutorSessions').where("isPaid", '!=', null)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const hour = new SessionRequest( //changed from volunteer request
                        doc.id,
                        doc.data().emailId,
                        doc.data().dateRequested,
                        doc.data().startTime,
                        doc.data().hoursRequested,
                        doc.data().duration,
                        doc.data().isAvailable,
                        doc.data().isAccepted,
                        doc.data().isPaid
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
    addSession,
    getSessionsByEmail,
    updateSessionsRecord,
    getUnPaidSessions,
    getSessionsByEmailInternal,
    getUnPaidSessionsInternal,
    getPaidSessionsInternal,
    getActiveSessions,
    getUnApprovedSessions,
    getSessions,
    getScheduledSessions,
    getCompletedSessions
}