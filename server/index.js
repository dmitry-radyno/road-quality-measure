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

const dataDir = path.normalize(path.resolve(__dirname, `../data/`));

app.post("/api/measurement", jsonParser, async function (req, res) {
    let fileName = path.resolve(dataDir, `${Date.now()}.json`);
    let data = JSON.stringify(req.body);

    fs.writeFile(fileName, data, (err) => {
        if (err) throw err;
        res.json({});
    });
});

app.get("/api/measurement/:name", async function (req, res) {
    let file = req.params.name.trim();

    if (file === "") {
        res.status(500).send("Invalid file name");
        return;
    }

    let fileName = path.normalize(path.resolve(dataDir, file));
    if (fileName.indexOf(dataDir) === -1) {
        res.status(500).send("Invalid file name");
        return;
    }

    if (fileName.substring(fileName.length - 4) !== "json") {
        res.status(500).send("Invalid file name");
        return;
    }

    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

app.get("/api/measurement", async function (req, res) {
    let dirName = path.resolve(__dirname, `../data/`);

    fs.readdir(dirName, function (err, files) {
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }
        let measurements = files.filter(file => file.substring(file.length - 5) === ".json");
        res.json(measurements);
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