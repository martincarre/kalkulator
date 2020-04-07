var kApp = require('../kApp/kApp');
var pdfGen = require('../pdfGen/app');

var appRouter = function (app) {

  app.get("/", function (req, res) {
    res.status(200).send({ 
      message: 'Connected to Kalkulator',
      connected: true
     });
  });

  app.post("/pmtCalc", function (req, res) {
    
    let payload = req.body; 

    var data = {
      totalInvest: null,
      totalRv: null,
      leasingDetails: null,
      equipments: null
    };

    for (let i = 0; i < payload.equipments.length; i++) {
      const currEquipment = payload.equipments[i];
      data.totalInvest += currEquipment.investment*1;
      if (currEquipment.rvSwitch) {
        data.totalRv += currEquipment.rv*1;
      }
    }

    data.leasingDetails = payload.leasingDetails;
    data.equipments = payload.equipments;
    if (!payload.leasingDetails.postpaymentSwitch) {
      data.leasingDetails.postpaymentSwitch = 1;
    } else {
      data.leasingDetails.postpaymentSwitch = 0;
    }

    var result = kApp(data);

    res.status(201).json(result);  
  });

  app.post("/printQuote", function (req, res) {
    let payload = req.body;

    var result = pdfGen(payload);

    res.status(201).send({
      message: 'success!'
    })
  })
}

module.exports = appRouter;