require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');


// Import commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}


// Upload commands
const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), { body: commands })
    .then(() => {
        console.log('Successfully registered application commands.');

        // Birthday command permissions
        const permissions = [
            {
                id: process.env.DISCORD_OWNER_ID,
                type: 2,
                permission: true,
            },
        ];

        const json = { permissions: permissions };

        rest.put(Routes.applicationCommandPermissions(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID, '915611973746577458'), { body: json })
            .then(() => console.log('Successfully registered command permissions.'))
            .catch(console.error);
    })
    .catch(console.error);
