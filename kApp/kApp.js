var pmtCalc = require('./pmtCalc');
var insCalc = require('./insCalc');

var kApp = function(payload) {
    switch (payload.period) {
        case 'm':
            payload.i = payload.i / 12;
            payload.n = payload.n*1;
            break;
        case 'q':
            payload.i = payload.i / 4;
            payload.n = payload.n / 3;
            break;
        case 's': 
            payload.i = payload.i / 2;
            payload.n = payload.n / 6;
            break;
        case 'a':
            payload.n = payload.n / 12;
            break;
        default: 
            payload.i = payload.i / 12;
            break;
    }

    if (payload.insurance) {
        var insPrice = insCalc(
            payload.pv*1,
            payload.period,
            payload.marketSel
        );
    }

    var result = pmtCalc(
        payload.n*1,
        payload.i/100,
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