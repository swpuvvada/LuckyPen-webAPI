class SessionRecord{
    constructor(id, emailId, dateRequested, hoursRequested, timeRequested, isAvailable) {
        this.id = id;
        this.emailId = emailId;
        this.dateRequested = dateRequested;
        this.hoursRequested = hoursRequested;
        this.timeRequested = timeRequested;
        this.isAvailable = isAvailable;
    }
}

module.exports = SessionRequest;