<template>
  <div class="layout">
    <sidebar></sidebar>
    <google-map></google-map>
  </div>
</template>

<script>
import Sidebar from "./Sidebar";
import GoogleMap from "./Map";

export default {
  name: "Layout",
  components: {Sidebar, GoogleMap}
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100vh;
  .sidebar {
    width: 30%;
  }
}
</style>