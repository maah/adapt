const { formatTime, formatDate } = require('../../commands/time');


describe('Time', () => {
    // Invalid
    test('Format: invalid', () => {
        expect(() => formatTime('')).toThrow();
        expect(() => formatTime('test')).toThrow();
        expect(() => formatTime('ten thirty')).toThrow();

        expect(() => formatTime('24:00')).toThrow();
        expect(() => formatTime('25:00')).toThrow();

        expect(() => formatTime('48:70:80 pm')).toThrow();
    });


    // Converted
    test('Format: converted', () => {
        expect(formatTime(102030)).toEqual('10:20:30');

        expect(formatTime('10 something 20 thing 30 stuff')).toEqual('10:20:30');
        expect(formatTime('10something20thing30stuff')).toEqual('10:20:30');

        expect(formatTime('10:308:20')).toEqual('10:30:08');
    });


    // hh:mm:ss (2 digits)
    test('Format: hh:mm:ss (2 digits)', () => {
        expect(formatTime('00:00:00')).toEqual('00:00:00');
        expect(formatTime('00 00 00')).toEqual('00:00:00');

        expect(formatTime('10:20:30')).toEqual('10:20:30');
        expect(formatTime('10 20 30')).toEqual('10:20:30');

        expect(formatTime('01:02:03')).toEqual('01:02:03');
        expect(formatTime('01 02 03')).toEqual('01:02:03');
    });


    // hh:mm:ss (1 digit)
    test('Format: hh:mm:ss (1 digit)', () => {
        expect(formatTime('0:0:0')).toEqual('00:00:00');
        expect(formatTime('0 0 0')).toEqual('00:00:00');

        expect(formatTime('1:2:3')).toEqual('01:02:03');
        expect(formatTime('1 2 3')).toEqual('01:02:03');
    });


    // hh:mm:ss (inconsistent amount of digit)
    test('Format: hh:mm:ss (inconsistent amount of digit)', () => {
        expect(formatTime('01:02:3')).toEqual('01:02:03');
        expect(formatTime('01 02 3')).toEqual('01:02:03');

        expect(formatTime('01:20:3')).toEqual('01:20:03');
        expect(formatTime('01 20 3')).toEqual('01:20:03');

        expect(formatTime('01:2:3')).toEqual('01:02:03');
        expect(formatTime('01 2 3')).toEqual('01:02:03');

        expect(formatTime('1:20:3')).toEqual('01:20:03');
        expect(formatTime('1 20 3')).toEqual('01:20:03');

        expect(formatTime('01:2:30')).toEqual('01:02:30');
        expect(formatTime('01 2 30')).toEqual('01:02:30');

        expect(formatTime('1:20:30')).toEqual('01:20:30');
        expect(formatTime('1 20 30')).toEqual('01:20:30');
    });


    // hh:mm
    test('Format: hh:mm', () => {
        expect(formatTime('10:20')).toEqual('10:20:00');
        expect(formatTime('10 20')).toEqual('10:20:00');

        expect(formatTime('10:2')).toEqual('10:02:00');
        expect(formatTime('8:2')).toEqual('08:02:00');
        expect(formatTime('8:20')).toEqual('08:20:00');
    });


    // hh
    test('Format: hh', () => {
        expect(formatTime('10')).toEqual('10:00:00');
        expect(formatTime('8')).toEqual('08:00:00');
    });


    // 00h 00m 00s
    test('Format: 00h 00m 00s', () => {
        expect(formatTime('10h20m30s40ms')).toEqual('10:20:30');
        expect(formatTime('10h20m30s')).toEqual('10:20:30');
        expect(formatTime('10h20m')).toEqual('10:20:00');
        expect(formatTime('10h')).toEqual('10:00:00');
    });


    // AM / PM
    test('Format: AM / PM', () => {
        expect(formatTime('8 am')).toEqual('08:00:00');
        expect(formatTime('8am')).toEqual('08:00:00');

        expect(formatTime('8 pm')).toEqual('20:00:00');
        expect(formatTime('8pm')).toEqual('20:00:00');

        expect(formatTime('8:30 am')).toEqual('08:30:00');
        expect(formatTime('8:30 pm')).toEqual('20:30:00');

        expect(formatTime('8:3 am')).toEqual('08:03:00');
        expect(formatTime('8:3 pm')).toEqual('20:03:00');

        expect(formatTime('12 am')).toEqual('00:00:00');
        expect(formatTime('12 pm')).toEqual('12:00:00');

        expect(formatTime('20 am')).toEqual('20:00:00');
        expect(formatTime('20 pm')).toEqual('20:00:00');

        expect(formatTime('15:30 pm')).toEqual('15:30:00');
        expect(formatTime('15:30 pm')).toEqual('15:30:00');

        expect(formatTime('10:20:30 am')).toEqual('10:20:30');
        expect(formatTime('10 20 30 pm')).toEqual('22:20:30');
    });
});


describe('Date', () => {
    const month = (new Date().getUTCMonth() + 1).toString().padStart(2, '0');
    const year = new Date().getUTCFullYear().toString();


    // Invalid
    test('Format: invalid', () => {
        expect(() => formatDate('')).toThrow();
        expect(() => formatDate('test')).toThrow();
        expect(() => formatDate('first of january')).toThrow();
        expect(formatDate('january 10')).toEqual(`10-${month}-${year}`);

        expect(() => formatDate('24-00')).toThrow();
        expect(() => formatDate('32-00')).toThrow();
        expect(() => formatDate('05-10-000')).toThrow();

        expect(() => formatDate('10:308:20')).toThrow();
        expect(formatDate('10:12:99999')).toEqual(`10-12-9999`);
    });


    // Converted
    test('Format: converted', () => {
        expect(formatDate(10123040)).toEqual('10-12-3040');

        expect(formatDate('10 something 12 thing 2030 stuff')).toEqual('10-12-2030');
        expect(formatDate('10something12thing2030stuff')).toEqual('10-12-2030');
    });


    // dd-MM-yyyy
    test('Format: dd-MM-yyyy', () => {
        expect(formatDate('21-11-2021')).toEqual('21-11-2021');
        expect(formatDate('21/11/2021')).toEqual('21-11-2021');
        expect(formatDate('21 11 2021')).toEqual('21-11-2021');

        expect(formatDate('08-08-2021')).toEqual('08-08-2021');
        expect(formatDate('8-8-2021')).toEqual('08-08-2021');
    });


    // dd-MM-yy
    // While technically supported, the result depends on the century
    // 99 may mean 1999 now, but 30 would be 2030
    // See formatDate()
    test('Format: dd-MM-yy', () => {
        /*expect(formatDate('21-11-21')).toEqual('21-11-2021');
        expect(formatDate('21/11/21')).toEqual('21-11-2021');
        expect(formatDate('21 11 21')).toEqual('21-11-2021');

        expect(formatDate('08-08-21')).toEqual('08-08-2021');
        expect(formatDate('8-8-21')).toEqual('08-08-2021');*/
    });


    // dd-MM
    test('Format: dd-MM', () => {
        expect(formatDate('21-11')).toEqual('21-11-' + year);
        expect(formatDate('21/11')).toEqual('21-11-' + year);
        expect(formatDate('21 11')).toEqual('21-11-' + year);
    });


    // dd
    test('Format: dd', () => {
        expect(formatDate('21')).toEqual(`21-${month}-${year}`);
    });
});