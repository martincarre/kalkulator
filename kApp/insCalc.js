const INSMOCK = require('../dbMocks/INSMOCK');
const MARGINMOCK = require('../dbMocks/MARGINMOCK');

var insCalc = function(pv, period, marketSel) {
    // INSERT CALL TO DB FOR INS PRICES + MARGIN;
    var price;
    var insMargin;
    var periodFact;

    switch (period) {
        case 'm':
            periodFact = 12;
            break;
        case 'q': 
            periodFact = 4;
            break;
        case 's':
            periodFact = 2;
            break;
        case 'a':
            periodFact = 1;
            break;
        default:
            periodFact = 12;
            break;
    }

    for(let i = 0; i < INSMOCK.length; i++) {
        var currConditions = INSMOCK[i];
        if(marketSel === currConditions.selector) {
            price = currConditions;
        }
    }

    for(let i = 0; i < MARGINMOCK.length; i++) {
        var currMargin = MARGINMOCK[i];
        if(currMargin.selector === 'INS') {
            insMargin = currMargin.value;
        }
    }

    let insuranceFactor = (price.value*1 * (1 + price.taxes*1)) * (1 + insMargin*1) / periodFact*1;

    let result = pv * insuranceFactor + (price.consor*1 / periodFact*1);

    return result.toFixed(2);
}

module.exports = insCalc;