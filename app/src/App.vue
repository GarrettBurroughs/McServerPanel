<template>
  <div id="consolePage">
    <h1>Minecraft Server Panel</h1>
    <InstanceControl v-on:newServer="createServer" />
    <ServerCreator v-show="shouldCreateServer" v-on:created="serverCreated" />
    <ServerControl />
    <Console />
  </div>
</template>

<script>
import Console from "./components/Console";
import ServerControl from "./components/ServerControl";
import InstanceControl from "./components/InstanceControl";
import ServerCreator from "./components/ServerCreator";

export default {
  name: "App",
  components: {
    Console,
    ServerControl,
    InstanceControl,
    ServerCreator
  },
  data() {
    return {
      shouldCreateServer: false,
      running: false
    };
  },
  methods: {
    createServer() {
      this.shouldCreateServer = true;
    },
    serverCreated() {
      this.shouldCreateServer = false;
    }
  }
};
</script>

<style></style>
