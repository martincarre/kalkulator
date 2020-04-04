var express = require("express");
var cors = require('cors');
var bodyParser = require("body-parser");
var routes = require("./routes/routes");

var app = express();

// -- SETUP CORS FOR PROD: https://daveceddia.com/access-control-allow-origin-cors-errors-in-react-express/
// var whiteList = ['NAME ORIGIN', ];
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whiteList.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else { 
//             callback(new Error('Origin not whitelisted - Access denied by CORS'))
//         }
//     }
// }


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});
