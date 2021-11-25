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


const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

// Server commands
if (process.env.DISCORD_GUILD_ID) {
    rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}


// Global commands
else {
    rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}