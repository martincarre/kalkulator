var kApp = require('../kApp/kApp');

var appRouter = function (app) {

  app.get("/", function (req, res) {
    res.status(200).send({ message: 'Welcome to our restful API' });
  });

  app.post("/pmtCalc", function (req, res) {
    let payload = req.query;  

    var result = kApp(payload);

    payload.quote = result;

    res.status(200).json(payload);  
  });
}

module.exports = appRouter;