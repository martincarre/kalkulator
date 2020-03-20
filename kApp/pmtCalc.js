var pmtCalc = function(n, i, pv, fv, type) {
    var numerator = pv * Math.pow((1 + i),n) - fv;
    var denominator = (1 + i * type) * ((Math.pow((1 + i), n) - 1) / i);
    var pmt = numerator / denominator;
    return pmt;
}

module.exports = pmtCalc;