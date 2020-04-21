const express = require('express');
const path = require('path')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const http = require('http').createServer(app)
const socketIO = require('socket.io');
const { spawn, exec } = require('child_process');
const fs = require('fs');

let script;
const port = 3000;
const io = socketIO(http);

const { getInstances, getAllVerions, createNewInstance } = require('./instanceManager');

const stdout = [];
let currentInstance = 'server1';

const processStdOut = (data) => {
    console.log(`Standard Out: ${data}`)
    data = data.toString('ascii')
    io.emit('stdOut', { content: data })
    stdout.push(data);
}

app.use(cors({
    origin: "http://localhost:8080"
}))

app.use(express.static('app/dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/stdout', (req, res) => {
    res.send(stdout);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/app/dist/index.html'));
})

app.get('/console', (req, res) => {
    res.sendFile(path.join(__dirname + "/client/console.html"));
})

app.get('/instances', (req, res) => {
    res.send(getInstances())
})

app.get('/currentInstance', (req, res) => {
    res.send({ currentInstance: currentInstance })
})

app.get('/getVersions', async (req, res) => {
    res.send(await getAllVerions(
        req.query.snapshot.toLowerCase() === "true",
        req.query.alpha.toLowerCase() === "true",
        req.query.beta.toLowerCase() === "true"
    ));
})

app.post('/start', (req, res) => {
    io.emit('message', { content: "attempting to start server" });

    console.log('attempting to start server');
    try {
        if (process.platform === "linux" || process.platform === "darwin") {
            script = spawn(`./scripts/ServerStart.sh`, [currentInstance]);
        }
        if (process.platform === "win32") {
            script = spawn(`.\\scripts\\ServerStart.bat`, [currentInstance]);
        }
        script.stdout.on('data', processStdOut);
        res.status(200)
    } catch{
        res.status(500)
    }
})

app.post('/stop', (req, res) => {
    try {
        io.emit('message', { content: 'stopping server' })
        if (process.platform === 'win32') {
            exec('taskkill /pid ' + script.pid + ' /T /F')
        } else {
            script.kill();
        }
        script = null;
        res.status(200);
    } catch{
        res.status(500);
    }
});

app.post('/select', (req, res) => {
    currentInstance = req.body.server;
    io.emit("message", { content: `switched to ${currentInstance}` })
});

app.get('/getFile/:file', (req, res) => {
    res.sendFile(path.join(__dirname, `minecraft/${currentInstance}/${req.params.file}`));
})

app.get('/getFiles/:dir', (req, res) => {
    res.send(fs.readdirSync(`./minecraft/${currentInstance}/${req.params.dir}`));
})

app.get('/getFiles', (req, res) => {
    res.send(fs.readdirSync(`./minecraft/${currentInstance}`));
})

app.post('/createServer', (req, res) => {
    try {
        createNewInstance(req.body.name, req.body.url);
        if (!req.body.name) throw { message: "Server needs a name" };

        io.emit("message", { content: `Creating server ${req.body.name}` });
        if (req.body.url) {
            io.emit("message", { content: `downloading server jar from ${req.body.url}` });
        } else {
            io.emit("message", { content: "folder created, please finish the rest of the manual setup before resuming" })
        }
        res.status(200)
    } catch (err) {
        io.emit("error", { content: "error creating severver" })
        io.emit("error", { content: `Error: ${err.message}` })
        res.status(500);
    }
})

io.on('connection', function (socket) {
    console.log('connected');
    socket.on('command', (command) => {
        console.log(command);
        if (script) {
            script.stdin.write(command + "\n");
        } else {
            io.emit('message', { content: "Server Not Running" });
        }
    });
});

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});