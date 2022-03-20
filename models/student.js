class Student {
    constructor(id, firstName, lastName, email, password, totalHours, isAdmin) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.totalHours = totalHours;
        this.name = this.firstName + ' ' + this.lastName;
        this.isAdmin = isAdmin;
    }
}

module.exports = Student;
