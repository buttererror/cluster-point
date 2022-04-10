<template>
  <div class="layout">
    <sidebar></sidebar>
    <google-map v-if="isMap"></google-map>
  </div>
</template>

<script>
import Sidebar from "./Sidebar";
import GoogleMap from "./Map";
import {EventBus} from "../js/Event";

export default {
  name: "Layout",
  components: {Sidebar, GoogleMap},
  data() {
    return {
      isMap: true
    }
  },
  mounted() {
    EventBus.$on("clear-map", () => {
      this.rerenderMap();
    });
  },
  methods: {
    rerenderMap() {
      this.isMap = false;
      this.$nextTick(() => {
        this.isMap = true;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100vh;
}
</style>