class VolunteerRequest{
    constructor(id, emailId, dateRequested, hoursRequested) {
        this.id = id;
        this.emailId = emailId;
        this.dateRequested = dateRequested;
        this.hoursRequested = hoursRequested;
    }
}

module.exports = VolunteerRequest;
