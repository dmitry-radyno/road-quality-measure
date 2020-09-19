var nconf = require("nconf");
var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var bodyParser = require("body-parser");
var fs = require("fs");
var util = require("util");

nconf.file("./server.config");
nconf.defaults({
    "http": {
        "port": 80
    }
});

var jsonParser = bodyParser.json()

var app = express();
app.use(express.static("../dist/"));

app.post("/api/measurement", jsonParser, async function (req, res) {
    fs.writeFile(`../data/${Date.now()}.json`, JSON.stringify(req.body), (err) => {
        if (err) throw err;
        res.send("{}");
    });
});

var httpServer = http.createServer(app);
httpServer.listen(nconf.get("http:port"));

if (nconf.get("https")) {
    const keyFile = nconf.get("https:keyFile");
    const certFile = nconf.get("https:certFile");
    const passphrase = nconf.get("https:passphrase");
    
    var httpsServer = https.createServer({
        key: fs.readFileSync(keyFile, "utf8"),
        cert: fs.readFileSync(certFile, "utf8"),
        passphrase
    }, app);
    
    httpsServer.listen(nconf.get("https:port"));
}