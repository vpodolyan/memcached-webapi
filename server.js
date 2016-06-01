var express = require("express");
var memjs = require('memjs')
var bodyParser = require('body-parser');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:1235');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var app = express();
app.use(bodyParser.json());
app.use(allowCrossDomain);

var memcached = memjs.Client.create("127.0.0.1:1555");

app.post("/put", function(req, res) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:1235');

	console.log(req.body);

	memcached.set(req.body.key, JSON.stringify(req.body.value), function (err, val) {
		if (err) throw err;

		var msg = req.body.key + "=" + req.body.value + " cached!"
		res.json({"err": 0, "msg": msg});
	}, 600);
});

app.get("/get/:key", function(req, res) {
	memcached.get(req.params.key, function(err, val) {
		if (err) throw err;

		res.json({"key": req.params.key, "value": JSON.parse(val.toString()) });
	});
});


app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
