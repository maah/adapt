const { SlashCommandBuilder } = require('@discordjs/builders');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const choices = months.map(v => [v, v]);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Update #birthday message')
        .setDefaultPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a new birthday')
                .addStringOption(option => option.setName('name').setDescription('Name of the user').setRequired(true))
                .addStringOption(option => option.setName('month').setDescription('Birthday month').setRequired(true)
                    .addChoices(choices)
                )
                .addNumberOption(option => option.setName('day').setDescription('Birthday day').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edit a birthday')
                .addStringOption(option => option.setName('name').setDescription('Name of the user').setRequired(true))
                .addStringOption(option => option.setName('month').setDescription('Birthday month').setRequired(true)
                    .addChoices(choices)
                )
                .addNumberOption(option => option.setName('day').setDescription('Birthday day').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a birthday')
                .addStringOption(option => option.setName('name').setDescription('Name of the user').setRequired(true))
        )
    ,
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const month = interaction.options.getString('month');
        const day = interaction.options.getNumber('day');


        // Parse birthdays
        const channel = await interaction.client.channels.fetch(process.env.DISCORD_BIRTHDAY_CHANNEL_ID);
        const message = await channel.messages.fetch(process.env.DISCORD_BIRTHDAY_MESSAGE_ID, { force: true });
        let birthdays = parseMessage(message.content);


        // Add / edit birthday
        if (interaction.options.getSubcommand() == 'add'
            || interaction.options.getSubcommand() == 'edit') {
            if (day < 1 || day > 31) {
                await interaction.reply({ content: 'Invalid day given: ' + day, ephemeral: true });
                return;
            }

            const index = birthdays.findIndex(v => v.name == name);

            // Overwrite
            if (index != -1)
                birthdays[index] = { name, month, day };
            else
                birthdays.push({ name, month, day });
        }


        // Remove birthday
        else if (interaction.options.getSubcommand() == 'remove') {
            const index = birthdays.findIndex(v => v.name == name);

            if (index == -1) {
                await interaction.reply({ content: 'Could not find user in birthday list: ' + name, ephemeral: true });
                return;
            }

            birthdays.splice(index, 1);
        }


        // Update birthday message
        const new_content = toMessage(birthdays);

        await message.edit(new_content);
        await interaction.reply({ content: 'Done.', ephemeral: true });
    },
};


function parseMessage(message) {
    const lines = message.split('\n');
    let birthdays = [];
    let month = '';

    for (const line of lines) {
        // Month
        if (line.startsWith('**'))
            month = line.substr(2, line.length - 4);


        // Birthday
        else if (line.startsWith('<')) {
            const day = line.substr(2, 2);
            const names = line.substr(line.indexOf(' ') + 1).split(', ');

            for (const name of names)
                birthdays.push({ name, month, day });
        }
    }

    return birthdays;
}


function toMessage(birthdays) {
    const emojis = ['<:00:594829375971524608>', '<:01:594829363883671553>', '<:02:594829348083597312>', '<:03:594829333500002305>', '<:04:594829320774615067>', '<:05:594829306346078220>', '<:06:594829292387434526>', '<:07:594829277489266751>', '<:08:594829260431294465>', '<:09:594829251660873729>', '<:10:594829243536375828>', '<:11:594829235051298836>', '<:12:594829226801364992>', '<:13:594829219540762624>', '<:14:594829210892107786>', '<:15:594829202113429505>', '<:16:594829191979991048>', '<:17:594829182173970465>', '<:18:594829173483110421>', '<:19:594829163601592326>', '<:20:594829154088910848>', '<:21:594829144542674944>', '<:22:594829134715289600>', '<:23:594829120689537024>', '<:24:594829110182936576>', '<:25:594829097004171274>', '<:26:594829087571181568>', '<:27:594829078217883649>', '<:28:594829068021661718>', '<:29:594829058047475712>', '<:30:594829048576737300>', '<:31:594829037071892491>'];
    let msg = '';


    for (const month of months) {
        let previousDay = 0;
        const month_birthdays = birthdays.filter(v => v.month == month);
        month_birthdays.sort((a, b) => parseInt(a.day) - parseInt(b.day));

        msg += `**${month}**`;


        for (const birthday of month_birthdays) {
            const day = parseInt(birthday.day);
            const emoji = emojis[day];

            if (day == previousDay)
                msg += `, ${birthday.name}`;
            else
                msg += `\n${emoji} ${birthday.name}`;

            previousDay = day;
        }

        msg += '\n\n';
    }


    // Remove last two line breaks (1 for month, 1 for last birthday)
    msg = msg.substr(0, msg.length - 2);
    return msg;
}
