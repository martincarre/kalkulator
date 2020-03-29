var kApp = require('../kApp/kApp');

var appRouter = function (app) {

  app.get("/", function (req, res) {
    res.status(200).send({ 
      message: 'Connected to Kalkulator',
      connected: true
     });
  });

  app.post("/pmtCalc", function (req, res) {
    let payload = req.body;  
    console.log(JSON.stringify(payload));

    var result = kApp(payload);

    payload.quote = result;

    res.status(201).json(payload);  
  });
}

module.exports = appRouter;