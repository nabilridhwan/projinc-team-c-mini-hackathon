const Response = require("./Response");

class NotFound extends Response {
    constructor(message = "Not Found") {
        super(404, {
            error: message,
        });
    }
}

module.exports = NotFound;
