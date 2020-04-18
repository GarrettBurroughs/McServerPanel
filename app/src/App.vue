<template>
  <div id="consolePage">
    <h1>Minecraft Server Panel</h1>
    <InstanceControl v-on:newServer="createServer" />
    <ServerControl />
    <Console />
  </div>
</template>

<script>
import Console from "./components/Console";
import ServerControl from "./components/ServerControl";
import InstanceControl from "./components/InstanceControl";

export default {
  name: "App",
  components: {
    Console,
    ServerControl,
    InstanceControl,
  },
  data() {
    return {
      shouldCreateServer: false,
      running: false,
    };
  },
  methods: {
    createServer() {
      this.shouldCreateServer = true;
    },
  },
};
</script>

<style></style>
