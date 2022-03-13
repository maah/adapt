const { SlashCommandBuilder } = require('@discordjs/builders');
const { log_type, log } = require('../utils/logger');
const roleColors = require('../data/roleColors.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Change your role color')
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('Displays your current role color')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Change your role color')
                .addStringOption(option => option.setName('color').setDescription('Hexadecimal color code (#000000)').setRequired(true))
        ),
    async execute(interaction) {
        const newColor = interaction.options.getString('color');
        const roleName = roleColors[interaction.member.id];

        if (!roleName) {
            await interaction.reply('Cannot find your custome role\'s name.\nCC: <@' + process.env.DISCORD_OWNER_ID + '> (fix required).');
            return;
        }

        const role = interaction.guild.roles.cache.find(r => r.name == roleName);

        if (!role) {
            await interaction.reply('Cannot find your custom role.\nCC: <@' + process.env.DISCORD_OWNER_ID + '> (fix required).');
            return;
        }

        if (interaction.options.getSubcommand() == 'get') {
            await interaction.reply('Your current color is: **' + role.hexColor + '**.\nTo change it, use /color set.');
            return;
        }

        try {
            await role.setColor(newColor);

            if (!interaction.member.roles.cache.has(role.id))
                interaction.member.roles.add(role);

            await interaction.reply(`Role updated '<@&${role.id}>'.`);
        }
        catch (err) {
            log(log_type.DISCORD, `/color ${newColor}: ${err}`, true);
            await interaction.reply({ content: 'Wrong color given, hexadecimal color code expected (#000000).', ephemeral: true });
        }
    },
};