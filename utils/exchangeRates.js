const { default: fetch } = require('node-fetch');
const { DateTime } = require('luxon');
const fs = require('fs');


async function updateExchangeRates() {
    // Currency names would be unavailable, exit
    if (!fs.existsSync('./data/currencies.json'))
        throw new Error('Could not find currency exchange rate data.');


    // Check once every 24 hours
    const data_stored = JSON.parse(fs.readFileSync('./data/currencies.json'));
    const diff = DateTime.utc().diff(DateTime.fromISO(data_stored.last_update), 'hours');

    if (diff.hours > 24) {
        const common = await getCommonCurrenciesRates();
        const crypto = await getCryptoCurrenciesRates();

        let currencies = {
            last_update: DateTime.utc().toJSON(),
            base_code: common.base_code,
            data: data_stored.data
        };

        for (const currency in common.conversion_rates) {
            const rate = common.conversion_rates[currency];

            if (currencies.data.hasOwnProperty(currency))
                currencies.data[currency].rate = rate;
        }

        for (const currency in crypto) {
            const rate = crypto[currency];

            if (currencies.data.hasOwnProperty(currency))
                currencies.data[currency].rate = rate;
        }

        fs.writeFileSync('./data/currencies.json', JSON.stringify(currencies));
    }
}


async function getCommonCurrenciesRates() {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATES_API_KEY}/latest/EUR`);

    if (!res.ok)
        return;

    return await res.json();
}


async function getCryptoCurrenciesRates() {
    const cryptoCurrencies = ['btc', 'eth'];
    let rates = {};

    for (const crypto of cryptoCurrencies) {
        const res = await fetch('https://api.cryptonator.com/api/ticker/eur-' + crypto);

        if (!res.ok)
            continue;

        const json = await res.json();
        rates[json.ticker.target] = json.ticker.price;
    }

    return rates;
}


module.exports = {
    updateExchangeRates
};