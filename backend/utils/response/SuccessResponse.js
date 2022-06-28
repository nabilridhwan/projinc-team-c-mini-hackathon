const Response = require("./Response");

class SuccessResponse extends Response {
    constructor(data = "OK") {
        super(200, { message: data });
    }
}

module.exports = SuccessResponse;
