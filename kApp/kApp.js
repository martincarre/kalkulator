var RATESMOCK = require('../dbMocks/RATESMOCK');

var pmtCalc = require('./pmtCalc');
var insCalc = require('./insCalc');

var kApp = function(payload) {
    var result = [];

    for (let e = 0; e < payload.equipment.length; e ++) {
        // CALCULATE FIQUOTE + INSQUOTE FOR EACH EQUIPMENT 
    }
    
    for (let n = 24; n < 96; n+=12) {

        // SETTING THE TENOR FOR KALK
        var t;
        // SETTING THE RATE
        var i;
        
        if(payload.customRate) {
            i = payload.customRate;
        } else {
            // CREATE CALL TO RATES DB;
            for(let j = 0; j < RATESMOCK.length; j++) {
                let currBucket = RATESMOCK[j];
                let currRange = currBucket.investRange;
                if (payload.pv*1 >= currRange.min && payload.pv*1<= currRange.max) {
                    for(let y = 0; y < currBucket.rates.length; y++) {
                        let currRate = currBucket.rates[y];
                        let currTenor = currRate.tenor;
                        if (n >= currTenor.min && n <= currTenor.max) {
                            i = currRate.rate;
                        }
                    }
                }
            }
        }

        // ADAPTING TENOR + RATE TO PERIOD
        switch (payload.period) {
            case 'm':
                i = i / 12;
                break;
            case 'q':
                i = i / 4;
                t = n / 3;
                break;
            case 's': 
                i = i / 2;
                t = n / 6;
                break;
            case 'a':
                t = n / 12;
                break;
            default: 
                i = i / 12;
                break;
        }
        
    // CALCULATING FINANCIAL QUOTE
        let currFiQuote = pmtCalc(
            t,
            i/100,
            payload.pv*1,
            payload.fv*1,
            payload.type*1,
            payload.commission*1
        );
        result.push({
            n: n,
            fiQuote: currFiQuote
        })
    }
    
    // CALCULATING INSURANCE
    if (payload.insurance) {
        var insPrice = insCalc(
            payload.pv*1,
            payload.period,
            payload.marketSel
        );
    }

    return {
        fiTable: result,
        insQuote: insPrice
    };
}

module.exports = kApp;