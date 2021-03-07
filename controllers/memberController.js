'use strict';

const firebase = require('../db');
const Member = require('../models/member');
const Volunteer = require('../models/volunteer')
const {getHoursRecordbyEmailInternal, getHoursToBeReveiwedInternal, getHoursReveiwedInternal, getHoursToBeReviewed} = require('./volunteerHoursController');
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

const getMember = async (req, res, next) => {
    try{
        const id = req.params.id;
        const member = await firestore.collection('members').doc(id);
        const data = await member.get();
        if(!data.exists){
            res.status(404).send('Member with the given ID not found')
        }else{
            res.send(data.data());
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

const getAllMembersInternal = async () => {
    try{
        const member = await firestore.collection('members');
        const data = await member.get()
        const memberArray = [];
        if(!data.empty){
            data.forEach(doc => {
                    const member = new Member(
                        doc.id,
                        doc.data().firstName,
                        doc.data().lastName,
                        doc.data().email,
                        null,
                        doc.data().totalHours
                    );
                    memberArray.push(member);
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
                    data.totalHours
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
    getMemberByEmailInternal
}