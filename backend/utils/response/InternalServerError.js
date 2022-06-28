const Response = require("./Response");

class InternalServerError extends Response {
    constructor(message = "Internal Server Error") {
        super(500, {
            error: message,
        });
    }
}

module.exports = InternalServerError;
