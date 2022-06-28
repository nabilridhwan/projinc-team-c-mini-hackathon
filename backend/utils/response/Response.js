class Response {
    constructor(status, data) {
        if(status >= 400){
            this.success = false
        }else{
            this.success = true
        }

        this.status = status;
        this.data = data;
    }
}

module.exports = Response;
