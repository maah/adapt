const { SlashCommandBuilder } = require('@discordjs/builders');
const { DateTime } = require('luxon');
const { getTimeZones } = require('@vvo/tzdb');

const us_states = {
    "Alabama": ["America/Chicago"],
    "Alaska": ["America/Anchorage", "America/Adak"],
    "Arizona": ["America/Phoenix"],
    "Arkansas": ["America/Chicago"],
    "California": ["America/Los_Angeles"],
    "Colorado": ["America/Denver"],
    "Connecticut": ["America/New_York"],
    "Delaware": ["America/New_York"],
    "Florida": ["America/New_York", "America/Chicago"],
    "Georgia": ["America/New_York"],
    "Hawaii": ["Pacific/Honolulu"],
    "Idaho": ["America/Boise", "America/Los_Angeles"],
    "Illinois": ["America/Chicago"],
    "Indiana": ["America/Indiana/Indianapolis", "America/Chicago"],
    "Iowa": ["America/Chicago"],
    "Kansas": ["America/Chicago", "America/Denver"],
    "Kentucky": ["America/New_York", "America/Chicago"],
    "Louisiana": ["America/Chicago"],
    "Maine": ["America/New_York"],
    "Maryland": ["America/New_York"],
    "Massachusetts": ["America/New_York"],
    "Michigan": ["America/Detroit", "America/Menominee"],
    "Minnesota": ["America/Chicago"],
    "Mississippi": ["America/Chicago"],
    "Missouri": ["America/Chicago"],
    "Montana": ["America/Denver"],
    "Nebraska": ["America/Chicago", "America/Denver"],
    "Nevada": ["America/Los_Angeles", "America/Denver"],
    "New Hampshire": ["America/New_York"],
    "New Jersey": ["America/New_York"],
    "New Mexico": ["America/Denver"],
    "New York": ["America/New_York"],
    "North Carolina": ["America/New_York"],
    "North Dakota": ["America/Chicago", "America/Denver"],
    "Ohio": ["America/New_York"],
    "Oklahoma": ["America/Chicago"],
    "Oregon": ["America/Los_Angeles", "America/Boise"],
    "Pennsylvania": ["America/New_York"],
    "Rhode Island": ["America/New_York"],
    "South Carolina": ["America/New_York"],
    "South Dakota": ["America/Chicago", "America/Denver"],
    "Tennessee": ["America/Chicago", "America/New_York"],
    "Texas": ["America/Chicago", "America/Denver"],
    "Utah": ["America/Denver"],
    "Vermont": ["America/New_York"],
    "Virginia": ["America/New_York"],
    "Washington": ["America/Los_Angeles"],
    "West Virginia": ["America/New_York"],
    "Wisconsin": ["America/Chicago"],
    "Wyoming": ["America/Denver"]
};
const timeZones = getTimeZones();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Display and convert time zones from anywhere in the world')

        // Display current time
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Display the current time in any country, US state, or time zone')
                .addStringOption(option => option.setName('input').setDescription('Country, state, or time zone').setRequired(true))
        )

        // Convert between time zones
        .addSubcommand(subcommand =>
            subcommand
                .setName('convert')
                .setDescription('Convert time beetween countries, US states, or time zones')
                .addStringOption(option => option.setName('time').setDescription('Time to convert from (hh:mm:ss)').setRequired(true))
                .addStringOption(option => option.setName('from').setDescription('Country, US state, or time zone to convert from').setRequired(true))
                .addStringOption(option => option.setName('to').setDescription('Country, US state, or time zone to convert to').setRequired(true))
                .addStringOption(option => option.setName('date').setDescription('(Optional) Date to convert from (format: dd/mm/yyyy)'))
        )
    ,
    async execute(interaction) {
        if (interaction.options.getSubcommand() == 'show') {
            const time = interaction.options.getString('input');

            const tzs = findTimeZones(time);

            if (tzs.type === 'null') {
                await interaction.reply({ content: 'Time zone not found: ' + time, ephemeral: true });
                return;
            }

            const msg = messageBuilder(tzs);

            if (msg.length < 1) {
                await interaction.reply({ content: 'Time zone not found: ' + time, ephemeral: true });
                return;
            }

            await interaction.reply(msg);
        }


        else if (interaction.options.getSubcommand() == 'convert') {
            const time = interaction.options.getString('time');
            const date = interaction.options.getString('date');
            const from = interaction.options.getString('from');
            const to = interaction.options.getString('to');

            if (from == to) {
                await interaction.reply({ content: 'Input and output time zones cannot be the same.', ephemeral: true });
                return;
            }


            // Time
            let startAt_time;

            try {
                startAt_time = formatTime(time);

                if (startAt_time.length < 1) {
                    await interaction.reply({ content: 'Invalid time given: ' + time, ephemeral: true });
                    return;
                }
            }

            catch (err) {
                await interaction.reply({ content: err.message, ephemeral: true });
                return;
            }


            // Date
            let startAt_date;

            if (date)
                try {
                    startAt_date = formatDate(date);

                    if (startAt_date.length < 1) {
                        await interaction.reply({ content: 'Invalid date given: ' + date, ephemeral: true });
                        return;
                    }
                }

                catch (err) {
                    await interaction.reply({ content: err.message, ephemeral: true });
                    return;
                }

            else
                startAt_date = DateTime.utc().toFormat('dd-MM-yyyy');


            // Parsing date + time
            const startAt = DateTime.fromFormat(startAt_date + ' ' + startAt_time, 'dd-MM-yyyy HH:mm:ss', { zone: 'UTC' });


            // Invalid date (eg: February 30)
            if (!startAt.isValid) {
                await interaction.reply({ content: startAt.invalidReason + '\n' + startAt.invalidExplanation, ephemeral: true });
                return;
            }


            // From
            const tzs_from = findTimeZones(from);

            if (tzs_from.type === 'null') {
                await interaction.reply({ content: 'Time zone not found: ' + from, ephemeral: true });
                return;
            }


            // To
            const tzs_to = findTimeZones(to);

            if (tzs_to.type === 'null') {
                await interaction.reply({ content: 'Time zone not found: ' + to, ephemeral: true });
                return;
            }


            // Calculate all time zones possible
            let msg = '';

            for (const tz_from of tzs_from.zones) {
                for (const tz_to of tzs_to.zones) {
                    const { diff, dayShift, dateString_from, dateString_conv } = convertTimeZones(startAt, tz_from, tzs_from.type, tz_to, tzs_to.type, date !== null);

                    const diff_hours = diff.hours.toString();
                    const diff_minutes = Math.abs(diff.minutes).toString().padStart(2, '0');
                    const sign = diff.hours < 0 ? '' : '+';

                    msg += `${dateString_from} -> ${dateString_conv} (**${sign}${diff_hours}:${diff_minutes}**) `;

                    // Next day(s)
                    if (dayShift > 0)
                        if (dayShift == 1)
                            msg += '(next day)\n';
                        else
                            msg += `(+ ${dayShift} days)\n`;

                    // Previous day(s)
                    else if (dayShift < 0)
                        if (dayShift == -1)
                            msg += '(previous day)\n';
                        else
                            msg += `(- ${Math.abs(dayShift)} days)\n`;

                    // Same day
                    else
                        msg += '\n';
                }
            }


            // Remove last line break
            msg = msg.substr(0, msg.length - 1);

            await interaction.reply(msg);
        }

        return;
    },
    formatTime,
    formatDate
};


function findTimeZones(query) {
    query = query.toLowerCase();


    // UTC / GMT
    if (query.startsWith('utc') || query.startsWith('gmt')) {
        const offset = (query === 'utc' || query === 'gmt') ? 0
            : parseInt(query.substr(3));

        if (isNaN(offset) || offset > 14 || offset < -12)
            return { type: 'null', zones: [] };

        const tzName = offset == 0 ? 'UTC'
            : offset < 0 ? 'UTC' + offset
                : 'UTC+' + offset;

        const rawFormat = 'Coordinated Universal Time'
            + (offset == 0 ? '' :
                ' '
                + (offset < 0 ? '' : '+')
                + offset
                + (Math.abs(offset) == 1 ? ' hour' : ' hours')
            );

        const tz = {
            name: tzName,
            alternativeName: tzName,
            group: [],
            continentCode: '',
            continentName: '',
            countryName: '',
            countryCode: '',
            mainCities: [],
            rawOffsetInMinutes: offset * 60,
            abbreviation: tzName,
            rawFormat
        };

        return { type: 'UTC', zones: [tz] };
    }


    else if (query == 'uk')
        query = 'united kingdom';


    // Find by US state
    const state = Object.entries(us_states).find(entry => entry[0].toLowerCase() == query);

    if (state) {
        let tzs = [];

        for (const IANA of state[1]) {
            let tz = timeZones.find(tz => tz.name.toLowerCase() == IANA.toLowerCase());

            // Avoid an issue with timezones that have been grouped together
            if (!tz)
                tz = timeZones.find(tz => tz.group.find(tzg => tzg.toLowerCase() == IANA.toLowerCase()));

            tz.countryName = state[0];
            tzs.push(tz);
        }

        return { type: 'state', zones: tzs };
    }


    const IANA = timeZones.find(tz => tz.name.toLowerCase() == query);
    if (IANA) return { type: 'IANA', zones: [IANA] };

    const country = timeZones.find(tz => tz.countryName.toLowerCase() == query);
    if (country) return { type: 'country', zones: [country] };

    const abbreviation = timeZones.find(tz => tz.abbreviation.toLowerCase() == query);
    if (abbreviation) return { type: 'abbreviation', zones: [abbreviation] };

    const city = timeZones.find(tz => tz.mainCities.find(city => city.toLowerCase() == query));
    if (city) return { type: 'city', zones: [city] };

    return { type: 'null', zones: [] };
}


function messageBuilder(tzs) {
    let final_msg = '';

    for (const tz of tzs.zones) {
        const dt = DateTime.utc().setZone(tz.name);

        let str = '';
        let offsetName = 'UTC' +
            (tz.rawOffsetInMinutes > 0 ? '+' + (tz.rawOffsetInMinutes / 60)
                : tz.rawOffsetInMinutes < 0 ? (tz.rawOffsetInMinutes / 60)
                    : '');

        switch (tzs.type) {
            case 'IANA':
                str = `Time for **${tz.name}** (${offsetName}): ${dt.toFormat('**hh:mm a** (MMMM dd)')}\n`;
                break;

            case 'UTC':
                str = `Time in **${offsetName}**: ${dt.toFormat('**hh:mm a** (MMMM dd)')}\n`;
                break;

            case 'abbreviation':
                str = `Time in **${tz.abbreviation}** (${offsetName}): ${dt.toFormat('**hh:mm a** (MMMM dd)')}\n`;
                break;

            case 'country':
                str = `Time in **${tz.countryName}** (${offsetName}): ${dt.toFormat('**hh:mm a** (MMMM dd)')}\n`;
                break;

            case 'city':
                str = `Time in **${tz.countryName}** (${offsetName}): ${dt.toFormat('**hh:mm a** (MMMM dd)')}\n`;
                break;

            case 'state':
                str = `Time in **${tz.countryName}** (${tz.abbreviation}, ${offsetName}): ${dt.toFormat('**hh:mm a** (MMMM dd)')}\n`;
                break;
        }

        final_msg += str;
    }


    // Not found
    if (final_msg.length < 1)
        final_msg = 'Time zone not found.';
    else
        // Remove last line break
        final_msg = final_msg.substr(0, final_msg.length - 1);

    return final_msg;
}


function messageBuilderConv(dt, tz, tz_type, includeDate) {
    let str = '';
    const offsetName = 'UTC' +
        (tz.rawOffsetInMinutes > 0 ? '+' + (tz.rawOffsetInMinutes / 60)
            : tz.rawOffsetInMinutes < 0 ? (tz.rawOffsetInMinutes / 60)
                : '');


    switch (tz_type) {
        case 'IANA':
            str = includeDate ? `${dt.toFormat('LLL dd yyyy, **hh:mm a**')} (${tz.name}: ${tz.abbreviation})`
                : `${dt.toFormat('**hh:mm a**')} (${tz.name}: ${tz.abbreviation})`;
            break;

        case 'UTC':
            str = includeDate ? `${dt.toFormat('LLL dd yyyy, **hh:mm a**')} (${offsetName})`
                : `${dt.toFormat('**hh:mm a**')} (${offsetName})`;
            break;

        case 'abbreviation':
            str = includeDate ? `${dt.toFormat('LLL dd yyyy, **hh:mm a**')} (${tz.abbreviation}: ${offsetName})`
                : `${dt.toFormat('**hh:mm a**')} (${tz.abbreviation}: ${offsetName})`;
            break;

        case 'country':
            str = includeDate ? `${dt.toFormat('LLL dd yyyy, **hh:mm a**')} (${tz.countryName}: ${tz.abbreviation})`
                : `${dt.toFormat('**hh:mm a**')} (${tz.countryName}: ${tz.abbreviation})`;
            break;

        case 'city':
            str = includeDate ? `${dt.toFormat('LLL dd yyyy, **hh:mm a**')} (${tz.countryName}: ${tz.abbreviation})`
                : `${dt.toFormat('**hh:mm a**')} (${tz.countryName}: ${tz.abbreviation})`;
            break;

        case 'state':
            str = includeDate ? `${dt.toFormat('LLL dd yyyy, **hh:mm a**')} (${tz.countryName}: ${tz.abbreviation})`
                : `${dt.toFormat('**hh:mm a**')} (${tz.countryName}: ${tz.abbreviation})`;
            break;
    }

    return str;
}


function convertTimeZones(dt_startAt, tz_from, tz_from_type, tz_to, tz_to_type, includeDate) {
    const dt_from = DateTime.utc().setZone(tz_from.name).set(
        {
            year: dt_startAt.year,
            month: dt_startAt.month,
            day: dt_startAt.day,
            hour: dt_startAt.hour,
            minute: dt_startAt.minute,
            second: dt_startAt.second
        }
    );

    const dt_conv = dt_from.plus({ minute: tz_to.rawOffsetInMinutes - tz_from.rawOffsetInMinutes });


    const diff = dt_conv.diff(dt_from, ['hours', 'minutes']);

    const dateString_from = messageBuilderConv(dt_from, tz_from, tz_from_type, includeDate);
    const dateString_conv = messageBuilderConv(dt_conv, tz_to, tz_to_type, includeDate);


    // 23:00 -> 00:00 next day, would be less than 1 day apart!
    // but here, we want to return '1', because we advance to the next day
    // The best way is to set both dates to the same time
    const dt_conv_time_reset = dt_conv.set({ hour: dt_from.hour, minute: dt_from.minute, second: dt_from.second });
    const dayShift = dt_conv_time_reset.diff(dt_from, 'days').days;


    return {
        //converted: dt_conv,
        diff,
        dayShift,
        dateString_from,
        dateString_conv
    };
}


function formatTime(time) {
    // Usual time formats
    // hh:mm:ss
    // hh mm ss
    // hh:mm
    // hh mm
    // hh
    // hh'h' mm'm' ss's' (20h 35m 50s)
    // Additionally: AM, PM
    // Returns hh:mm:ss

    time = time.toString().toLowerCase();


    // Hours not found
    const { parsed: hours, stopped_at: stop_hours } = parseDigits(time, 'hours');

    if (!hours)
        throw new Error('Invalid hours given: ' + time);


    // Minutes
    const { parsed: minutes, stopped_at: stop_minutes } = parseDigits(time.substr(stop_hours), 'minutes');

    if (!minutes)
        return hours + ':00:00';


    // Seconds
    const { parsed: seconds } = parseDigits(time.substr(stop_hours + stop_minutes), 'seconds');

    if (!seconds)
        return hours + ':' + minutes + ':00';


    // hh:mm:ss
    return hours + ':' + minutes + ':' + seconds;
}


function formatDate(date) {
    // Usual date formats
    // dd-MM-yyyy
    // dd/MM/yyyy
    // dd MM yyyy
    // dd MM
    // dd
    // d M yyyy
    // dd MM yy
    // Returns dd-MM-yyyy

    date = date.toString();


    // Day not found
    const { parsed: day, stopped_at: stop_day } = parseDigits(date, 'day');

    if (!day)
        throw new Error('Invalid date given: ' + date);


    // dd
    const { parsed: month, stopped_at: stop_month } = parseDigits(date.substr(stop_day), 'month');

    if (!month) {
        const month = DateTime.utc().get('month').toString().padStart(2, '0');
        const year = DateTime.utc().get('year').toString();

        return day + '-' + month + '-' + year;
    }


    // dd-MM
    const { parsed: year } = parseDigits(date.substr(stop_day + stop_month), 'year');

    if (!year) {
        const year = DateTime.utc().get('year').toString();

        return day + '-' + month + '-' + year;
    }


    // dd-MM-yyyy
    return day + '-' + month + '-' + year;
}


function parseDigits(digits, type) {
    if (!digits)
        return {};

    else if (!type)
        throw new Error('No date type given.');


    const max_chars = type == 'year' ? 4 : 2;
    let stopped_at = 0;
    let digitCount = 0;
    let buffer = '';


    for (const char of digits) {
        const isNumber = !isNaN(parseInt(char));
        stopped_at++;

        // Append to the buffer, up to x characters
        if (isNumber) {
            buffer += char;
            digitCount++;

            if (digitCount >= max_chars)
                break;
        }

        else if (buffer != '')
            break;
    }


    // Check for errors
    const buffer_int = parseInt(buffer);


    // Invalid day
    if (type == 'day') {
        if (buffer_int > 31 || buffer_int < 1)
            throw new Error('Invalid day given: ' + buffer_int);

        else if (buffer == '')
            return {};
    }


    // Invalid month
    else if (type == 'month') {
        if (buffer_int > 12 || buffer_int < 1)
            throw new Error('Invalid month given: ' + buffer_int);

        else if (buffer == '') {
            buffer = DateTime.utc().get('month').toString();
        }
    }


    // Invalid year, convert when possible
    else if (type == 'year') {
        if (buffer_int < 0 || buffer.length == 3)
            throw new Error('Invalid year given: ' + buffer_int);

        // 99 -> 1999 or 2099, depending on the closest
        else if (buffer.length == 2) {
            const current_century = Math.trunc(DateTime.utc().get('year') / 100);
            const century = buffer_int - current_century >= 50 ? current_century - 1 : current_century;

            buffer = century + buffer;
        }

        // Cannot accurately guess, use current year instead
        else if (buffer.length < 2)
            buffer = DateTime.utc().get('year').toString();
    }


    // Invalid hour
    if (type == 'hour' || type == 'hours') {
        if (buffer_int > 23 || buffer_int < 0)
            throw new Error('Invalid hours given: ' + buffer_int);
        // 12 hours clock to 24 hours clock
        else if (digits.endsWith('am') && buffer_int == 12) // string is already in lowercase
            buffer = '0';

        else if (digits.endsWith('pm') && buffer_int < 12)
            buffer = (buffer_int + 12).toString();

        else if (buffer == '')
            return {};
    }


    // Invalid minutes
    if (type == 'minute' || type == 'minutes') {
        if (buffer_int > 60 || buffer_int < 0)
            throw new Error('Invalid minutes given: ' + buffer_int);

        else if (buffer == '')
            return {};
    }


    // Invalid seconds
    if (type == 'second' || type == 'seconds') {
        if (buffer_int > 60 || buffer_int < 0)
            throw new Error('Invalid seconds given: ' + buffer_int);

        else if (buffer == '')
            return {};
    }


    const final = buffer.padStart(2, '0');

    return { stopped_at, parsed: final };
}