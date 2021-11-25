const { SlashCommandBuilder } = require('@discordjs/builders');
const translatte = require('translatte');
const { languages } = require('translatte');
const { MessageEmbed } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate text between two languages')
        .addStringOption(option => option.setName('to').setDescription('Language to translate in').setRequired(true))
        .addStringOption(option => option.setName('text').setDescription('Text to translate').setRequired(true))
        .addStringOption(option => option.setName('from').setDescription('Language to translate from'))
    ,
    async execute(interaction) {
        const from = interaction.options.getString('from');
        const to = interaction.options.getString('to');
        const text = interaction.options.getString('text');

        if (text.length >= 512) {
            await interaction.reply({ content: 'Message too long, it must be 512 characters or less.', ephemeral: true });
            return;
        }

        // Parse languages
        const auto = { code: 'auto', name: 'Automatic' };
        const from_parsed = from ? findLanguage(from) ?? auto : auto;
        const to_parsed = findLanguage(to);

        if (!to_parsed) {
            await interaction.reply({ content: 'Language not found: ' + to, ephemeral: true });
            return;
        }


        // Translate
        try {
            const res = await translatte(text, { from: from_parsed.code, to: to_parsed.code });

            const translation = res.text.substr(0, 1023);
            const original = (res.from.text.didYouMean || res.from.text.autoCorrected)
                ? res.from.text.value
                : text;


            // Send as embed
            const embed = new MessageEmbed();
            embed.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL());
            embed.addField(`Original (${from_parsed.name})`, original, false);
            embed.addField(`Translation (${to_parsed.name})`, translation, false);
            embed.setColor(9880278);

            await interaction.reply({ embeds: [embed] });
        }
        catch (err) {
            await interaction.reply({ content: 'Error during translation:\n' + err.message, ephemeral: true });
            return;
        }
    },
};


function findLanguage(query) {
    query = query.toLowerCase();

    // Language codes: en, fr, jp...
    if (languages.hasOwnProperty(query))
        return { code: query, name: languages[query] };


    // returns ['en', 'english'] or null
    const language = Object.entries(languages).find(v => v[1]
        && typeof (v[1]) == 'string'
        && v[1].toLowerCase() == query
    );


    // Return language code
    if (language)
        return { code: language[0], name: language[1] };
}