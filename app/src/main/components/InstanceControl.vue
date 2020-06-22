<template>
  <div id="dropdown-menu">
    Current Server Instance:
    <div id="server-select" v-if="instances.length !== 0">
      <select name="dropdown" id="dropdown" v-model="currentServer">
        <option disabled value>Please select one</option>
        <option v-for="instance in instances" v-bind:key="instance">{{ instance }}</option>
      </select>
      <div>
        <button v-on:click="selectServer">Select Server</button>

        <button id="create-server-right" v-on:click="newServer">Create New Server</button>
      </div>
    </div>

    <div v-else id="new-server">
      <button id="create-server" v-on:click="newServer">Create New Server</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serverUrl:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/"
          : "http://localhost:3000/",
      currentServer: "",
      instances: []
    };
  },
  mounted() {
    fetch(this.serverUrl + "instances")
      .then(res => res.json())
      .then(data => {
        this.instances = data;
      });
    fetch(this.serverUrl + "currentInstance")
      .then(res => res.json())
      .then(data => {
        this.currentServer = data.currentInstance;
      });
  },
  methods: {
    newServer: function() {
      this.$emit("newServer");
    },
    selectServer: async function() {
      await fetch(this.serverUrl + "select", {
        method: "POST",
        body: JSON.stringify({
          server: this.currentServer
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      fetch(this.serverUrl + "currentInstance")
        .then(res => res.json())
        .then(data => {
          this.currentServer = data.currentInstance;
        });
    }
  }
};
</script>

<style>
#dropdown {
  display: inline-block;
  width: 200px;
}
#new-server {
  display: inline-block;
}

#server-select {
  display: inline-block;
  width: 100%;
}

#server-select * {
  display: inline;
  margin-right: 10px;
}
</style>
