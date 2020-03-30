var RATESMOCK = require('../dbMocks/RATESMOCK');

var pmtCalc = require('./pmtCalc');
var insCalc = require('./insCalc');

var kApp = function(payload) {
    var result = [];
    const totalPrice = payload.leaseParams.totalInvest;

    console.log('New Operation Recieved:\n', payload);

    for (let e = 0; e < payload.equipment.length; e ++) {
        // CALCULATE FIQUOTE + INSQUOTE FOR EACH EQUIPMENT 
        const currEquipmentDetails = payload.equipment[e];
        var currPv = currEquipmentDetails.price*1;
        var currFv = currEquipmentDetails.rv*1;
        var currMarket = currEquipmentDetails.market;
        result.push({
            investNumber: e,
            invest: currPv,
            rv: currFv,
            fiQuotes: [],
            insQuote: 0
        });

        for (let n = 24; n < 96; n+=12) {
    
            // SETTING THE TENOR FOR KALK
            var t;
            // SETTING THE RATE
            var i;
            
            if(payload.leaseParams.customRate) {
                i = payload.leaseParams.customRate;
            } else {
                // CREATE CALL TO RATES DB;
                for(let j = 0; j < RATESMOCK.length; j++) {
                    let currBucket = RATESMOCK[j];
                    let currRange = currBucket.investRange;
                    if (totalPrice*1 >= currRange.min && totalPrice*1 <= currRange.max) {
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
            switch (payload.leaseParams.period) {
                case 'm':
                    i = i / 12;
                    t = n;
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
                    t = n;
                    break;
            }
            
        // CALCULATING FINANCIAL QUOTE
            let currFiQuote = pmtCalc(
                t,
                i/100,
                currPv,
                currFv,
                payload.leaseParams.type*1
            );
            for (let s = 0; s < result.length; s ++) {
                let currEquip = result[s];
                if (currEquip.investNumber === e) {
                    result[s].fiQuotes.push({
                        n: n,
                        quote: currFiQuote
                    });
                }
            }
        }
        // CALCULATING INSURANCE
        if (payload.leaseParams.insurance) {
            var insPrice = insCalc(
                currPv,
                payload.leaseParams.period,
                currMarket
            );
            for (let s = 0; s < result.length; s ++) {
                let currEquip = result[s];
                if (currEquip.investNumber === e) {
                    result[s].insQuote = insPrice;
                }
            }
        }
    }
    

    return result;
}

module.exports = kApp;