require('dotenv').config();
const { Client: DiscordClient, Collection, Intents } = require('discord.js');
const { DateTime } = require('luxon');
const fs = require('fs');
const { updateExchangeRates } = require('./utils/exchangeRates');



Main();

async function Main() {
	// Log
	const startTime = DateTime.utc().toFormat('LLLL dd, yyyy') + ' at ' + DateTime.utc().toFormat('HH:mm:ss');
	console.log(`\n--- ${startTime} ---`);


	// Update data
	await updateExchangeRates();
	setInterval(updateExchangeRates, 90000000); // 25 hours
	
	if (!fs.existsSync('./data/roleColors.json'))
		fs.writeFileSync('./data/roleColors.json', '{}');


	// Discord: init
	const discord = new DiscordClient({ intents: [Intents.FLAGS.GUILDS] });
	discord.commands = new Collection();


	// Discord: commands
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		discord.commands.set(command.data.name, command);
	}


	// Discord: events
	const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const event = require(`./events/${file}`);

		if (event.once)
			discord.once(event.name, (...args) => event.execute(...args));
		else
			discord.on(event.name, (...args) => event.execute(...args));
	}


	// Discord: login
	discord.login(process.env.DISCORD_TOKEN);
}
