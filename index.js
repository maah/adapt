require('dotenv').config();
const { Client: DiscordClient, Collection, Intents } = require('discord.js');
const fs = require('fs');


// Init
const discord = new DiscordClient({ intents: [Intents.FLAGS.GUILDS] });
discord.commands = new Collection();


// Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	discord.commands.set(command.data.name, command);
}


// Events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		discord.once(event.name, (...args) => event.execute(...args));
	} else {
		discord.on(event.name, (...args) => event.execute(...args));
	}
}


discord.login(process.env.DISCORD_TOKEN);