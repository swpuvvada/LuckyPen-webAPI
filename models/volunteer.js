class Volunteer{
    constructor(id, emailId, dateRequested, dateReviewed, hoursRequested, isAccepted, reviewedBy) {
        this.id = id;
        this.emailId = emailId;
        this.dateRequested = dateRequested;
        this.dateReviewed = dateReviewed;
        this.hoursRequested = hoursRequested;
        this.isAccepted = isAccepted;
        this.reviewedBy = reviewedBy;
    }
}

module.exports = Volunteer;
