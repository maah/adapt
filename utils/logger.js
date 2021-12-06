const { DateTime } = require('luxon');

const log_type = {
    DISCORD: 'Discord'
};


function log(module, message, isError) {
    const time = DateTime.utc().toFormat('LLL dd | HH:mm:ss');

    if (isError)
        console.error(`[${time} | ${module}] ${message}`);
    else
        console.log(`[${time} | ${module}] ${message}`);
}

module.exports = {
    log,
    log_type
}