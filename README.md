# Discord bot template (Node.js)

This template is based on [discordjs.guide](https://discordjs.guide/).  
Please create a `.env` file with the variables below.  
[Learn more about environment variables here](https://discordjs.guide/creating-your-bot/#using-environment-variables).

## This template includes:

### Slash commands
- A simple "Ping" command that replies with "Pong"

### Events
- A simple "ready" event that is fired after the bot is logged into Discord
- A "interactionCreate" event which handles slash commands

### Scripts
- index: the bot itself
- deploy-commands: run this to update slash commands

### Environment variables
- DISCORD_TOKEN: your bot's token
- DISCORD_CLIENT_ID: your bot's Application ID
- DISCORD_GUILD_ID: (Optional) the server to push commands to, or all servers if omitted
