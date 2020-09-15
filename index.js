var nconf = require("nconf");
var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");

nconf.file("./server.config");
nconf.defaults({
    'http': {
        "port": 80
    }
});

var app = express();
app.use(express.static("./dist/"));

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