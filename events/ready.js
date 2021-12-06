const { log, log_type } = require('../utils/logger');


module.exports = {
    name: 'ready',
    once: true,
    async execute(discord) {
        log(log_type.DISCORD, 'Ready');
    },
};