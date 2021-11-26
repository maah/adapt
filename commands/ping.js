const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows latency and uptime'),
    async execute(interaction) {
        try {
            const reply = await interaction.reply({ content: 'Ping...', fetchReply: true });

            const uptime = interaction.client.uptime;
            const days = Math.floor(uptime / 86400000);
            const hours = Math.floor(uptime / 3600000) % 24;
            const minutes = Math.floor(uptime / 60000) % 60;
            const seconds = Math.floor(uptime / 1000) % 60;

            await interaction.editReply(`**Pong**: ${reply.createdTimestamp - interaction.createdTimestamp}ms.\n`
                + `**API Latency**: ${Math.round(interaction.client.ws.ping)}ms\n`
                + `**Uptime**: ${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
        catch (err) {
            console.error(err);
        }
    },
};