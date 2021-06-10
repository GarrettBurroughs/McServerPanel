<template>
  <div id="creator">
    <h3>Server Name:</h3>
    <input type="text" id="name" v-model="serverName" />
    <div id="version">
      <h4>Create from minecraft Version</h4>
      <div id="version-options">
        Include:
        <input
          type="checkbox"
          name="snapshot"
          id="snapshot"
          v-model="snapshot"
          v-on:change="getVersions"
        />
        Snapshots
        <input
          type="checkbox"
          name="alpha"
          id="alpha"
          v-model="alpha"
          v-on:change="getVersions"
        />
        Alpha versions
        <input
          type="checkbox"
          name="beta"
          id="beta"
          v-model="beta"
          v-on:change="getVersions"
        />
        Beta Versions
      </div>Version:
      <select v-model="version">
        <option disabled value>Please select one</option>
        <option v-for="version in versions" v-bind:key="version.id">{{ version.id }}</option>
      </select>
      <button v-on:click="createFromVersion">Create!</button>
    </div>or
    <div id="url">
      <h4>Create from download url</h4>
      <input type="text" id="download-url" v-model="url" />
      <button v-on:click="createFromUrl">Create!</button>
    </div>or
    <div id="manual">
      <h4>
        Create manually (for this you must manually place the server jar in the
        generated folder)
      </h4>A folder will be generated under
      <code>minecraft/{server name}</code>
      <br />
      <button v-on:click="createManual">Create!</button>
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
      versions: [],
      alpha: false,
      beta: false,
      snapshot: false,
      version: "0",
      url: "",
      serverName: ""
    };
  },
  mounted() {
    fetch(this.serverUrl + `getVersions?snapshot=false&beta=false&alpha=false`)
      .then(res => res.json())
      .then(data => {
        this.versions = data;
      });
  },
  methods: {
    getVersions() {
      fetch(
        this.serverUrl +
          `getVersions?snapshot=${this.snapshot}&beta=${this.beta}&alpha=${this.alpha}`
      )
        .then(res => res.json())
        .then(data => {
          console.log(data);
          this.versions = data;
        });
    },
    createManual() {
      fetch(this.serverUrl + "createServer", {
        method: "POST",
        body: JSON.stringify({
          name: this.serverName
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      this.$emit("created");
    },
    async createFromVersion() {
      let idx = findVersion(this.versions, this.version);
      console.log(this.version);
      console.log(idx);
      console.log(this.versions[idx]);
      let downloadURL = await fetch(this.versions[idx].url)
        .then(res => res.json())
        .then(data => data.downloads.server.url);
      fetch(this.serverUrl + "createServer", {
        method: "POST",
        body: JSON.stringify({
          name: this.serverName,
          url: downloadURL
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      this.$emit("created");
    },
    createFromUrl() {
      fetch(this.serverUrl + "createServer", {
        method: "POST",
        body: JSON.stringify({
          name: this.serverName,
          url: this.url
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      this.$emit("created");
    }
  }
};

function findVersion(arr, version) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === version) {
      return i;
    }
  }
}
</script>

<style>
#version select {
  display: inline-block;
  width: 200px;
}
#creator div {
  background: rgb(255, 255, 255);
  border-radius: 10px;
  padding: 5px;
}

#creator {
  border-width: 2px;
  border-style: solid;
  border-color: rgba(155, 77, 202, 0.9);
  padding: 15px;
  border-radius: 15px;
}

h3 {
  display: inline;
}
#name {
  width: 300px;
  display: inline-block;
  margin-left: 20px;
  font-size: 24px;
}

#url input {
  width: 400px;
}
</style>
