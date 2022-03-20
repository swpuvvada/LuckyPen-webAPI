class SessionRequest{
constructor(id, emailId, dateRequested, startTime, hoursRequested, duration, isAccepted, isPaid){
        this.id = id;
        this.emailId = emailId;
        this.dateRequested = dateRequested;
        this.startTime = startTime;
        this.hoursRequested = hoursRequested;
        this.duration = duration;
        this.isAccepted = isAccepted;
        this.isPaid = isPaid;
    }
}

module.exports = SessionRequest;
