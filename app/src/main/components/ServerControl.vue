<template>
  <div id="serverControl">
    <h2>Server Control</h2>
    <button v-on:click="startServer">Start Server</button>
    <button v-on:click="stopServer">Stop Server</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serverUrl:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/"
          : "http://localhost:3000/"
    };
  },
  methods: {
    startServer: function() {
      console.log("starting server");
      fetch(this.serverUrl + "start", {
        method: "POST"
      }).then(response => {
        console.log(response);
      });
    },
    stopServer: function() {
      fetch(this.serverUrl + "stop", {
        method: "POST"
      }).then(response => {
        console.log(response);
      });
    }
  }
};
</script>

<style>
#serverControl button {
  display: inline;
  margin-right: 10px;
}
</style>
