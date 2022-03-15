class SessionRequest{
    constructor(id, emailId, dateRequested, timeRequested, cost, isPaid) {
        this.id = id;
        this.emailId = emailId;
        this.dateRequested = dateRequested;
        this.timeRequested = timeRequested;
        this.cost = cost;
        this.isPaid = isPaid;
    }
}

module.exports = SessionRequest;
