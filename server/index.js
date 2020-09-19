var nconf = require("nconf");
var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");

nconf.file(path.resolve(__dirname, "server.config"));
nconf.defaults({
    "http": {
        "port": 80
    }
});

var jsonParser = bodyParser.json({
    limit: "4mb"
});

var app = express();
app.use(express.static(path.resolve(__dirname, "../dist/")));

app.post("/api/measurement", jsonParser, async function (req, res) {
    let fileName = path.resolve(__dirname, `../data/${Date.now()}.json`);
    let data = JSON.stringify(req.body);

    fs.writeFile(fileName, data, (err) => {
        if (err) throw err;
        res.send("{}");
    });
});

var httpServer = http.createServer(app);
httpServer.listen(nconf.get("http:port"));

console.log("Running http");

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
    console.log("Running https");
}