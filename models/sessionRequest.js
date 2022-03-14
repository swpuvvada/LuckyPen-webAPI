class VolunteerRequest{
    constructor(id, emailId, dateRequested, hoursRequested, isAccepted, reviewedBy) {
        this.id = id;
        this.emailId = emailId;
        this.dateRequested = dateRequested;
        this.hoursRequested = hoursRequested;
        this.isAccepted = isAccepted;
        this.reviewedBy = reviewedBy;
    }
}

module.exports = VolunteerRequest;
