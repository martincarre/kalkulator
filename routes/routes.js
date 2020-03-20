var pmtCalc = require('../kApp/pmtCalc');

var appRouter = function (app) {

  app.get("/", function (req, res) {
    res.status(200).send({ message: 'Welcome to our restful API' });
  });

  app.get("/pmtCalc", function (req, res) {
    let payload = {
        i: 0.0025,
        n: 36,
        pv: 100,
        fv: 30,
        type: 1
    }

    var result = pmtCalc(
        payload.n,
        payload.i,
        payload.pv,
        payload.fv,
        payload.type,
        );

    payload.resutl = result;

    res.status(200).json(payload);
    
  });

}

module.exports = appRouter;