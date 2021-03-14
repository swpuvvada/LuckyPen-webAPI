'use strict';

const firebase = require('../db');
const Member = require('../models/member');
const firestore = firebase.firestore();

const addMember = async(req, res, next) => {
    try {
        const data = req.body;
        const doc = await firestore.collection('members').add(data);
        res.send({url: '/member/' + doc.id});
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const getMember = async (req, res, next) => {
    try{
        const id = req.params.id;
        let member = await getMemberInternal(id);

        if(member == null){
            res.status(404).send('Member with the given ID not found')
        }else{
            res.send(member);
        }
    }catch (error){
        res.status(400).send(error.message);
    }
}

const getMemberInternal = async (id) => {
    try{
        const member = await firestore.collection('members').doc(id);
        const doc = await member.get();
        if(!doc.exists){
            return null;
        }else{
            let data = doc.data();
            return new Member(
                doc.id,
                data.firstName,
                data.lastName,
                data.email,
                data.password,
                data.totalHours,
                data.isAdmin
            );
        }
    }catch (error){
        res.status(400).send(error.message);
    }
}

const getAllMembers = async (req, res, next) => {
    try{
        let memberArray = await getAllMembersInternal();
        res.send(memberArray);
    } catch (error) {
        res.status(400).send(error.massage);
    }
}

//gets all members' information for the table on Admin Page
const getAllMembersInternal = async () => {
    try{
        const data = await firestore.collection('members').get();
        const memberArray = [];
        if(!data.empty){
            data.forEach(doc => {
                    if (doc.data().isAdmin != true) {
                        const member = new Member(
                            doc.id,
                            doc.data().firstName,
                            doc.data().lastName,
                            doc.data().email,
                            null,
                            doc.data().totalHours,
                            doc.data().isAdmin
                        );
                        memberArray.push(member);
                    }
            });
        }
        return (memberArray);
    } catch (error) {
        console.log(error.massage);
    }
}

const updateMember = async (req, res, next) => {
    try{
        const id = req.params.id;
        const member = await firestore.collection('members').doc(id);
        const data = req.body;
        await member.update(data);
        res.send('Member record updated successfuly');
    }catch (error){
        res.status(400).send(error.message);
    }
}

const updateMemberData= async(emailTotalHourData) => {
    try {
        for (let emailId in emailTotalHourData) {
            await firestore.collection('members').where('email', '==', emailId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let docId = doc.id;
                    let totalHours = doc.data().totalHours;
                    totalHours = (totalHours == undefined) ? emailTotalHourData[emailId] : totalHours + emailTotalHourData[emailId];
                    let dataToUpdate = {'totalHours': totalHours};
                    updateTotalHour(docId, dataToUpdate);
                })
            })
            .catch((error) => {
                console.log(error.massage);
            });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateTotalHour = async (id, data) => {
    await firestore.collection('members').doc(id).update(data);
}

const getMemberByEmail = async (req, res, next) => {
    let members = [];
    let emailId = req.params.emailId;
    await firestore.collection('members').where('email', '==', emailId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let storedPassword = doc.password;
                
                members.push(doc.data());
            });
            res.send(members[0]);
        })
        .catch((error) => {
            res.status(400).send(error.message);
        });
}

const getMemberByEmailInternal = async(emailId) => {
    let member = null;
    await firestore.collection('members').where('email', '==', emailId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                member = new Member(
                    doc.id,
                    data.firstName,
                    data.lastName,
                    data.email,
                    data.password,
                    data.totalHours,
                    data.isAdmin
                );
                return;
            });
        })
        .catch((error) => {
            console.log(error.message);
            member = null;
        });
    return member;
}

module.exports = {
    addMember,
    getMember,
    updateMember,
    getMemberByEmail,
    getAllMembers,
    getAllMembersInternal,
    getMemberByEmailInternal,
    getMemberInternal,
    updateMemberData
}