var fvCalc = function(pv, pmt, i, n, type) {
    var fv = pv * Math.pow((1 + i), n) - pmt * (1 + i * type) * ((Math.pow((1 + i), n) -1) / i);
    return fv;
}

module.exports = fvCalc;