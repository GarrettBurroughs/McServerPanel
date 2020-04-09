let socket = io();


let app = new Vue({
    el: "#consolePage",
    data: {
        logs: [],
        currentCommand: "",
        socket: socket
    },
    mounted: function () { 
        fetch(window.location.href + 'stdout').then(data => data.json()).then(json => {
            this.logs = json;
            console.log(json);
        });
    },
    methods: {
        submitCommandOnEnter: function (e) {
            if (e.keyCode === 13) { 
                console.log(this.currentCommand);
                this.submitCommand();
            }
        },
        submitCommand: function () {
            this.socket.emit('command', this.currentCommand);
            this.currentCommand = "";
        },
        startServer: function () {
            fetch(window.location.href + 'start', { method: 'POST' }).then(response => { console.log(response) });
        },
        stopServer: function () {
            fetch(window.location.href + 'stop', { method: 'POST' }).then(response => { console.log(response) });
        }
    }
})

socket.on('stdOut', (e) => {
    console.log(e);
    app.logs.push(e.content);
    let webConsole = document.getElementById('console');
    setTimeout(() => { webConsole.scrollTop = webConsole.scrollHeight }, 10)
})