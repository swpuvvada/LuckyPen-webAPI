'use strict';

const firebase = require('../db');
const Student = require('../models/student');
const firestore = firebase.firestore();

const addStudent = async(req, res, next) => {
    try {
        const data = req.body;
        const doc = await firestore.collection('students').add(data);
        res.send({url: '/student/' + doc.id});
    } catch(error) {
        res.status(400).send({error: error.message});
    }
}

const getStudent = async (req, res, next) => {
    try{
        const id = req.params.id;
        let student = await getStudentInternal(id);

        if(student == null){
            res.status(404).send('Student with the given ID not found')
        }else{
            res.send(student);
        }
    }catch (error){
        res.status(400).send(error.message);
    }
}

const getStudentInternal = async (id) => {
    try{
        const student = await firestore.collection('students').doc(id);
        const doc = await student.get();
        if(!doc.exists){
            return null;
        }else{
            let data = doc.data();
            return new Student(
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

const getAllStudents = async (req, res, next) => {
    try{
        let studentArray = await getAllStudentsInternal();
        res.send(studentArray);
    } catch (error) {
        res.status(400).send(error.massage);
    }
}

//gets all students' information for the table on Admin Page
const getAllStudentsInternal = async () => {
    try{
        const data = await firestore.collection('students').get();
        const studentArray = [];
        if(!data.empty){
            data.forEach(doc => {
                    if (doc.data().isAdmin != true) {
                        const student = new Student(
                            doc.id,
                            doc.data().firstName,
                            doc.data().lastName,
                            doc.data().email,
                            null,
                            doc.data().totalHours,
                            doc.data().isAdmin
                        );
                        studentArray.push(student);
                    }
            });
        }
        return (studentArray);
    } catch (error) {
        console.log(error.massage);
    }
}

const updateStudent = async (req, res, next) => {
    try{
        const id = req.params.id;
        const student = await firestore.collection('students').doc(id);
        const data = req.body;
        await student.update(data);
        res.send('Student record updated successfuly');
    }catch (error){
        res.status(400).send(error.message);
    }
}

const updateStudentData= async(emailTotalHourData) => {
    try {
        for (let emailId in emailTotalHourData) {
            await firestore.collection('students').where('email', '==', emailId)
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
    await firestore.collection('students').doc(id).update(data);
}

const getStudentByEmail = async (req, res, next) => {
    let students = [];
    let emailId = req.params.emailId;
    await firestore.collection('students').where('email', '==', emailId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let storedPassword = doc.password;
                
                students.push(doc.data());
            });
            res.send(students[0]);
        })
        .catch((error) => {
            res.status(400).send(error.message);
        });
}

const getStudentByEmailInternal = async(emailId) => {
    let student = null;
    await firestore.collection('students').where('email', '==', emailId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                student = new Student(
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
            student = null;
        });
    return student;
}

module.exports = {
    addStudent,
    getStudent,
    updateStudent,
    getStudentByEmail,
    getAllStudents,
    getAllStudentsInternal,
    getStudentByEmailInternal,
    getStudentInternal,
    updateStudentData
}