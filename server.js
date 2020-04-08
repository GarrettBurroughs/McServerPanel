const express = require('express');
const path = require('path')
const app = express();

const http = require('http').createServer(app)
const socketIO = require('socket.io');
const { spawn } = require('child_process');
const stream = require('stream');


const script = spawn('./script.sh')
const port = 3000;
const io = socketIO(http);

const stdout = [];

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

io.on('connection', function (socket) {
    console.log('connected');
    socket.on('command', (command) => {
        console.log(command);
        script.stdin.write(command + "\n");
        // writeToStream(script.stdin, command);
    });
});

script.stdout.on('data', (data) => {
    console.log(`Standard Out: ${data}`)
    data = data.toString('ascii')
    io.emit('stdOut', { content: data })
    stdout.push(data);
});


http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function writeToStream(streamToWrite, input) {
    const stdinStream = new stream.Readable();
    stdinStream.push(input);  
    stdinStream.push(null);   
    stdinStream.pipe(streamToWrite);
}