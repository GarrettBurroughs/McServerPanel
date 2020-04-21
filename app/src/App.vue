<template>
  <div id="consolePage">
    <h1>Minecraft Server Panel</h1>
    <ServerControl />
    <Console />
  </div>
</template>

<script>
import Console from "./components/Console";
import ServerControl from "./components/ServerControl";

export default {
  name: "MC Server Panel",
  components: {
    Console,
    ServerControl,
  },
};
</script>

<style></style>
