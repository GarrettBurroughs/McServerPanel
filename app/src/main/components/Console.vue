<template>
  <div id="console">
    <div id="terminal">
      <div
        class="logMessage"
        v-for="(log, index) in logs"
        v-bind:key="index"
        v-bind:class="log.type"
      >
        <span id="console-header">console></span>
        {{ log.message }}
      </div>
    </div>
    <input type="text" v-model="currentCommand" v-on:keyup="submitCommandOnEnter" />
    <button v-on:click="submitCommand">submit command</button>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      logs: [],
      currentCommand: "",
      serverUrl:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/"
          : "http://localhost:3000/",
      socket: io("http://localhost:3000/")
    };
  },
  mounted() {
    fetch(this.serverUrl + "stdout")
      .then(data => data.json())
      .then(json => {
        json.forEach(element => {
          this.logs.push({ type: "log", message: element });
        });
      });

    this.socket.on("stdOut", e => {
      this.logs.push({
        type: "log",
        message: e.content
      });
      let webConsole = document.getElementById("console");
      setTimeout(() => {
        webConsole.scrollTop = webConsole.scrollHeight;
      }, 10);
    });

    this.socket.on("message", e => {
      this.logs.push({
        type: "message",
        message: e.content
      });
    });

    this.socket.on("error", e => {
      this.logs.push({
        type: "error",
        message: e.content
      });
    });
  },
  updated() {
    let elem = this.$el.querySelector("#terminal");
    elem.scrollTop = elem.clientHeight;
  },
  methods: {
    submitCommandOnEnter: function(e) {
      if (e.keyCode === 13) {
        this.submitCommand();
      }
    },
    submitCommand: function() {
      this.socket.emit("command", this.currentCommand);
      this.currentCommand = "";
    }
  }
};
</script>

<style>
#terminal {
  background-color: black;
  border-radius: 5px;
  padding: 10px;
  height: 500px;
  overflow-x: auto;
}

#console-header {
  font-weight: 500;
  color: rgb(200, 200, 200);
}

.message {
  font-weight: 600;
  color: rgb(198, 207, 43);
}

.error {
  font-weight: 600;
  color: rgb(255, 50, 50);
}
</style>
