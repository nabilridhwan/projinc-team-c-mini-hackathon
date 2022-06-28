const Response = require("./Response");

class BadRequest extends Response {
    constructor(message = "Bad Request") {
        super(400, {
            error: message,
        });
    }
}

module.exports = BadRequest;
