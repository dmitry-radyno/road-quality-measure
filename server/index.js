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
    let data = req.body;

    let id = Date.now().toString();

    let metaFileName = path.resolve(dataDir, `${id}.meta.json`);
    let meta = {
        id,
        description: data.description,
        type: data.type
    };

    let dataFileName = path.resolve(dataDir, `${id}.data.json`);
    let points = data.data;

    fs.writeFile(metaFileName, JSON.stringify(meta), (err) => {
        if (err) throw err;

        fs.writeFile(dataFileName, JSON.stringify(points), (err) => {
            if (err) throw err;

            res.json({});
        });
    });
});

app.get("/api/measurement/:name", async function (req, res) {
    let id = req.params.name.trim();

    if (id === "") {
        res.status(500).send("Invalid file name");
        return;
    }

    let metaFileName = path.normalize(path.resolve(dataDir, `${id}.meta.json`));
    let dataFileName = path.normalize(path.resolve(dataDir, `${id}.data.json`));

    if (metaFileName.indexOf(dataDir) === -1 || dataFileName.indexOf(dataDir) === -1) {
        res.status(500).send("Invalid file name");
        return;
    }

    let meta = await readFile(metaFileName);
    let data = await readFile(dataFileName);

    res.send(JSON.stringify({
        ...JSON.parse(meta),
        data: JSON.parse(data)
    }));
});

const readFile = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
};

const readJsonFile = async (fileName) => {
    let data = await readFile(fileName);
    return JSON.parse(data);
};

app.get("/api/measurement", async function (req, res) {
    let dirName = path.resolve(__dirname, `../data/`);

    fs.readdir(dirName, async (err, files) => {
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }
        let metaFiles = files.filter(file => file.substring(file.length - 9) === "meta.json");
        let meta = await Promise.all(metaFiles.map(f => path.resolve(dirName, f)).map(readJsonFile));

        res.json(meta);
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