const yup = require("yup");

const YUP_SCHEMAS = {
    logTime: yup.object().shape({
        start_date: yup.date(),
        end_date: yup.date(),
        // interval_unit: yup.string().oneOf(["day", "week", "month"]).required(),
    }),
};

module.exports = YUP_SCHEMAS;
