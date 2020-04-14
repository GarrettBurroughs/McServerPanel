const express = require('express');
const path = require('path')
const app = express();

const http = require('http').createServer(app)
const socketIO = require('socket.io');
const { spawn } = require('child_process');
const fs = require('fs');

let script;
const port = 3000;
const io = socketIO(http);

const { getInstances } = require('./instanceManager');

const stdout = [];
let currentInstance = 'server1';

const processStdOut = (data) => {
    console.log(`Standard Out: ${data}`)
    data = data.toString('ascii')
    io.emit('stdOut', { content: data })
    stdout.push(data);
}

app.use(express.static('client'));

app.get('/stdout', (req, res) => {
    res.send(stdout);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
})

app.get('/console', (req, res) => {
    res.sendFile(path.join(__dirname + "/client/console.html"));
})

app.get('/instances', (req, res) => {
    res.send(getInstances())
})

app.post('/start', (req, res) => {
    try {
        script = spawn(`./ServerStart.sh`, [currentInstance]);
        script.stdout.on('data', processStdOut);
        res.status(200)
    } catch{
        res.status(500)
    }
})

app.post('/stop', (req, res) => {
    try {
        io.emit('stdOut', { content: 'stopping server' })
        script.kill();
        script = null;
        res.status(200);
    } catch{
        res.status(500);
    }
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

io.on('connection', function (socket) {
    console.log('connected');
    socket.on('command', (command) => {
        console.log(command);
        if (script) {
            script.stdin.write(command + "\n");
        } else {
            io.emit('stdOut', { content: "Server Not Running" });
        }
    });
});

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});