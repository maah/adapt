const { log, log_type } = require('../functions/utils');


module.exports = {
    name: 'ready',
    once: true,
    async execute(discord) {
        log(log_type.DISCORD, 'Ready');
    },
};