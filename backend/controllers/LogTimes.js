const LogTime = require("../model/log_time");
const InternalServerError = require("../utils/response/InternalServerError");
const SuccessResponse = require("../utils/response/SuccessResponse");

const LogTimes = {
    /**
     * Gets all log times
     * @param {Request} req
     * @param {Response} res
     * @param {Next} next
     */
    getAllLogTimes: async (req, res, next) => {
        try {
            const data = await LogTime.getAllLogTimes();
            return res.json(new SuccessResponse(data));
        } catch (error) {
            return next(new InternalServerError("Error getting log times"));
        }
    },
};

module.exports = LogTimes;
