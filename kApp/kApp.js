var RATESMOCK = require('../dbMocks/RATESMOCK');

var pmtCalc = require('./pmtCalc');
var insCalc = require('./insCalc');

var kApp = function(payload) {
    // CREATE CALL TO RATES DB;
    var i;

    for(let j = 0; j < RATESMOCK.length; j++) {
        let currBucket = RATESMOCK[j];
        let currRange = currBucket.investRange;
        if (payload.pv*1 >= currRange.min && payload.pv*1<= currRange.max) {
            for(let y = 0; y < currBucket.rates.length; y++) {
                let currRate = currBucket.rates[y];
                let currTenor = currRate.tenor;
                if (payload.n*1 >= currTenor.min && payload.n*1 <= currTenor.max) {
                    i = currRate.rate;
                }
            }
        }
    }


    switch (payload.period) {
        case 'm':
            i = i / 12;
            payload.n = payload.n*1;
            break;
        case 'q':
            i = i / 4;
            payload.n = payload.n / 3;
            break;
        case 's': 
            i = i / 2;
            payload.n = payload.n / 6;
            break;
        case 'a':
            payload.n = payload.n / 12;
            break;
        default: 
            i = i / 12;
            break;
    }

    if (payload.insurance === 'true') {
        var insPrice = insCalc(
            payload.pv*1,
            payload.period,
            payload.marketSel
        );
    }

    var result = pmtCalc(
        payload.n*1,
        i/100,
        payload.pv*1,
        payload.fv*1,
        payload.type*1,
        payload.commission*1
    );

    return {
        fiQuote: result,
        insQuote: insPrice
    };
}

module.exports = kApp;