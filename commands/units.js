const { SlashCommandBuilder } = require('@discordjs/builders');
const { allMeasures, default: unitConfig } = require('convert-units');
const unit = unitConfig(allMeasures);

const units_area = [['Square Meter (m²)', 'm2'], ['Square Kilometer (km²)', 'km2'], ['Square Centimeter (cm²)', 'cm2'], ['Square Millimeter (mm²)', 'mm2'], ['Hectare (ha)', 'ha'], ['Square Inch (in²)', 'in2'], ['Square Foot (ft²)', 'ft2'], ['Square Yard (yd²)', 'yd2'], ['Acre (ac)', 'ac'], ['Square Mile (mi²)', 'mi2']];
const units_data = [['Bit (b)', 'b'], ['Kilobit (Kb)', 'Kb'], ['Megabit (Mg)', 'Mb'], ['Terabit (Tb)', 'Tb'], ['Byte (B)', 'B'], ['Kilobyte (KB)', 'KB'], ['Megabyte (MB)', 'MB'], ['Gigabyte (GB)', 'GB'], ['Terabyte (TB)', 'TB']];
const units_length = [['Meter (m)', 'm'], ['Kilometer (km)', 'km'], ['Centimeter (cm)', 'cm'], ['Millimeter (mm)', 'mm'], ['Inch (in)', 'in'], ['Foot (ft)', 'ft'], ['US Survey Foot (survey ft)', 'ft-us'], ['Yard (yd)', 'yd'], ['Fathom (fathom)', 'fathom'], ['Mile (mi)', 'mi'], ['Nautical Mile (nMi)', 'nMi']];
const units_mass = [['Gram (g)', 'g'], ['Kilogram (kg)', 'kg'], ['Milligram (mg)', 'mg'], ['Metric Tonne (mt)', 'mt'], ['Ounce (oz)', 'oz'], ['Pound (lb)', 'lb'], ['Ton (t)', 't']];
const units_speed = [['Metre per second (m/s)', 'm/s'], ['Kilometre per hour (km/h)', 'km/h'], ['Mile per hour (mph)', 'mph'], ['Knot (knot)', 'knot'], ['Foot per second (ft/s)', 'ft/s'], ['Foot per minute (ft/min)', 'ft/min']];
const units_temperature = [['Celsius (°C)', 'C'], ['Fahrenheit (°F)', 'F'], ['Kelvin (K)', 'K'], ['Rankine (R)', 'R']];
const units_time = [['Millisecond', 'ms'], ['Second', 's'], ['Minute', 'min'], ['Hour', 'h'], ['Day', 'd'], ['Week', 'week'], ['Month', 'month'], ['Year', 'year']];
const units_volume = [['Cubic Meter (m³)', 'm3'], ['Cubic Kilometer (km³)', 'km3'], ['Cubic Centimeter (cm³)', 'cm3'], ['Cubic Millimeter (mm³)', 'mm3'], ['Litre (l)', 'l'], ['Kilolitre (kl)', 'kl'], ['Decilitre (dl)', 'dl'], ['Centilitre (cl)', 'cl'], ['Millilitre (ml)', 'ml'], ['Cubic inch (in³)', 'in3'], ['Cubic foot (ft³)', 'ft3'], ['Cubic yard (yd³)', 'yd3'], ['Fluid Ounce (fl-oz)', 'fl-oz'], ['Teaspoon (tsp)', 'tsp'], ['Tablespoon (tbs)', 'Tbs'], ['Cup (cup)', 'cup'], ['Pint (pnt)', 'pnt'], ['Quart (qt)', 'qt'], ['Gallon (gal)', 'gal']];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unit')
        .setDescription('Convert between units')

        // Area
        .addSubcommand(subcommand =>
            subcommand
                .setName('area')
                .setDescription('Convert between units of area')
                .addStringOption(option => option.setName('from').setDescription('From unit').setRequired(true)
                    .addChoices(units_area)
                )
                .addStringOption(option => option.setName('to').setDescription('To unit').setRequired(true)
                    .addChoices(units_area)
                )
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )

        // Data
        .addSubcommand(subcommand =>
            subcommand
                .setName('data')
                .setDescription('Convert between units of data storage')
                .addStringOption(option => option.setName('from').setDescription('From unit').setRequired(true)
                    .addChoices(units_data)
                )
                .addStringOption(option => option.setName('to').setDescription('To unit').setRequired(true)
                    .addChoices(units_data)
                )
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )

        // Length
        .addSubcommand(subcommand =>
            subcommand
                .setName('length')
                .setDescription('Convert between units of length')
                .addStringOption(option => option.setName('from').setDescription('From unit').setRequired(true)
                    .addChoices(units_length)
                )
                .addStringOption(option => option.setName('to').setDescription('To unit').setRequired(true)
                    .addChoices(units_length)
                )
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )

        // Mass
        .addSubcommand(subcommand =>
            subcommand
                .setName('mass')
                .setDescription('Convert between units of mass')
                .addStringOption(option => option.setName('from').setDescription('From unit').setRequired(true)
                    .addChoices(units_mass)
                )
                .addStringOption(option => option.setName('to').setDescription('To unit').setRequired(true)
                    .addChoices(units_mass)
                )
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )

        // Speed
        .addSubcommand(subcommand =>
            subcommand
                .setName('speed')
                .setDescription('Convert between units of speed')
                .addStringOption(option => option.setName('from').setDescription('From unit').setRequired(true)
                    .addChoices(units_speed)
                )
                .addStringOption(option => option.setName('to').setDescription('To unit').setRequired(true)
                    .addChoices(units_speed)
                )
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )

        // Temperature
        .addSubcommand(subcommand =>
            subcommand
                .setName('temperature')
                .setDescription('Convert between units of temperature')
                .addStringOption(option => option.setName('from').setDescription('From unit').setRequired(true)
                    .addChoices(units_temperature)
                )
                .addStringOption(option => option.setName('to').setDescription('To unit').setRequired(true)
                    .addChoices(units_temperature)
                )
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )

        // Time
        .addSubcommand(subcommand =>
            subcommand
                .setName('time')
                .setDescription('Convert between units of time')
                .addStringOption(option => option.setName('from').setDescription('From unit').setRequired(true)
                    .addChoices(units_time)
                )
                .addStringOption(option => option.setName('to').setDescription('To unit').setRequired(true)
                    .addChoices(units_time)
                )
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )

        // Volume
        .addSubcommand(subcommand =>
            subcommand
                .setName('volume')
                .setDescription('Convert between units of volume')
                .addStringOption(option => option.setName('from').setDescription('From unit').setRequired(true)
                    .addChoices(units_volume)
                )
                .addStringOption(option => option.setName('to').setDescription('To unit').setRequired(true)
                    .addChoices(units_volume)
                )
                .addNumberOption(option => option.setName('amount').setDescription('Amount').setRequired(true))
        )
    ,
    async execute(interaction) {
        const from = interaction.options.getString('from');
        const to = interaction.options.getString('to');
        const amount = interaction.options.getNumber('amount');


        if (amount > 1000000000000) {
            await interaction.reply({ content: 'The amount given is too big, maximum expected: 1 000 000 000 000.', ephemeral: true });
            return;
        }

        else if (from == to) {
            await interaction.reply({ content: 'Input and output units cannot be the same.', ephemeral: true });
            return;
        }


        const converted = parseFloat(unit(amount).from(from).to(to).toFixed(2));

        if (interaction.options.getSubcommand() == 'temperature') {
            const degreesSign = (from == 'C' || from == 'F') ? '°' : '';
            await interaction.reply(`${amount} ${degreesSign}${from} = ${converted} ${degreesSign}${to}`);
        }

        else
            await interaction.reply(`${amount} ${from} = ${converted} ${to}`);
        return;
    },
};
