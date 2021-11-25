const { SlashCommandBuilder } = require('@discordjs/builders');
const currencies = require('../data/currencies.json');
const currenciesTop = require('../data/currenciesTop.json');
const currenciesByCountry = require('../data/currenciesByCountry.json');

const options = [];

for (const code of currenciesTop)
    options.push([currencies.data[code].name + ' (' + code + ')', code]);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('currency')
        .setDescription('Convert between currencies')
        .addSubcommand(subcommand =>
            subcommand
                .setName('common')
                .setDescription('(Recommended) Easily convert between common currencies')
                .addStringOption(option => option.setName('from').setDescription('From currency (code or name)').setRequired(true)
                    .addChoices(options)
                )
                .addStringOption(option => option.setName('to').setDescription('To currency (code or name)').setRequired(true)
                    .addChoices(options)
                )
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('any')
                .setDescription('Convert between any currencies')
                .addStringOption(option => option.setName('from').setDescription('From currency (code or name)').setRequired(true))
                .addStringOption(option => option.setName('to').setDescription('To currency (code or name)').setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('find')
                .setDescription('Find the currency of a country')
                .addStringOption(option => option.setName('country').setDescription('Country name').setRequired(true))
        )
    ,
    async execute(interaction) {
        // Find currency by country
        if (interaction.options.getSubcommand() == 'find') {
            const country_raw = interaction.options.getString('country');
            const country = Object.keys(currenciesByCountry).find(key => key.toLowerCase() === country_raw.toLowerCase());

            if (!country) {
                await interaction.reply({ content: `Country not found: ${country_raw}`, ephemeral: true });
                return;
            }

            const currencyCode = currenciesByCountry[country];
            const currency = currencies.data[currencyCode]?.name;

            if (currencyCode && currency)
                await interaction.reply(`${country}'s currency: ${currency} (${currencyCode})`);
            else if (currencyCode)
                await interaction.reply(`${country}'s currency: ${currencyCode}`);
            else
                await interaction.reply({ content: `Could not find ${country}'s currency`, ephemeral: true });

            return;
        }


        // Convert currencies
        const input_raw = interaction.options.getString('from').toUpperCase();
        const input = currencySymbolToCode(input_raw)
            ?? currencyAlias(input_raw)
            ?? getCurrencyCodeByName(input_raw)
            ?? input_raw;

        const amount = Math.abs(interaction.options.getNumber('amount'));

        const output_raw = interaction.options.getString('to').toUpperCase();
        const output = currencySymbolToCode(output_raw)
            ?? currencyAlias(output_raw)
            ?? getCurrencyCodeByName(output_raw)
            ?? output_raw;


        if (amount > 1000000000000) {
            await interaction.reply({ content: 'The amount given is too big, maximum expected: 1 000 000 000 000.', ephemeral: true });
            return;
        }

        else if (input == output) {
            await interaction.reply({ content: 'Input and output currencies cannot be the same.', ephemeral: true });
            return;
        }

        else if (!currencies.data.hasOwnProperty(input)) {
            await interaction.reply({ content: `Currency not found: ${input_raw}`, ephemeral: true });
            return;
        }

        else if (!currencies.data.hasOwnProperty(output)) {
            await interaction.reply({ content: `Currency not found: ${output_raw}`, ephemeral: true });
            return;
        }


        let result = '';

        // Base currency would usually be EUR or USD
        // base -> ?
        if (input == currencies.base_code) {
            result = (amount * currencies.data[output].rate).toString();
        }

        // ? -> base
        else if (output == currencies.base_code) {
            result = (amount / currencies.data[input].rate).toString();
        }

        // ? -> base -> ?
        else {
            const toEur = amount / currencies.data[input].rate;
            result = (toEur * currencies.data[output].rate).toString();
        }

        if (result.length > 10)
            result = result.substr(0, 10);

        const input_name = currencies.data[input].name;
        const output_name = currencies.data[output].name;

        await interaction.reply(`${amount} ${input_name} (${input}) = ${result} ${output_name} (${output})`);
    },
};


function currencySymbolToCode(symbol) {
    switch (symbol) {
        case '€': return 'EUR';
        case '$': return 'USD';
        case '£': return 'GBP';
        case '¥': return 'JPY';
        case '₴': return 'UAH';
        case '₡': return 'CRC';
        case '₦': return 'NGN';
        case '₱': return 'PHP';
        case '₮': return 'MNT';
        case '₩': return 'KRW';
        case '₺': return 'TRY';
        case '₵': return 'GHS';
        case '฿': return 'THB';
        case '₫': return 'VND';
        case '₭': return 'LAK';
        case '₹': return 'INR';
        case '৳': return 'BDT';
        case '₪': return 'ILS';
        case '₲': return 'PYG';
        default: return null;
    }
}


function currencyAlias(name) {
    switch (name.toLowerCase()) {
        case 'euros': return 'EUR';
        case 'dollar': return 'USD';
        case 'dollars': return 'USD';
        case 'american dollar': return 'USD';
        case 'american dollars': return 'USD';
        case 'yen': return 'JPY';
        case 'won': return 'KRW';
        case 'pound': return 'GBP';
        case 'pounds': return 'GBP';
        case 'shekel': return 'ILS';
        case 'shekels': return 'ILS';
        case 'real': return 'BRL';
        case 'renminbi': return 'CNY';
        case 'zloty': return 'PLN';
        case 'ruble': return 'RUB';
        case 'rubles': return 'RUB';
        case 'taiwan dollar': return 'TWD';
        case 'taiwan dollars': return 'TWD';
        case 'rand': return 'ZAR';
        default: return null;
    }
}


function getCurrencyCodeByName(value) {
    return Object.keys(currencies.data).find(key => currencies.data[key]?.name.toLowerCase() === value.toLowerCase());
}