<template>
  <div class="sidebar">
    <h1>
      Groups
    </h1>
    <div>
      <div v-for="group in groups" :key="group.id" class="group">
        <button>{{group.name}}</button>
        <div v-for="point in group.points" :key="point.id">
          <span class="point-name">{{point.name}}</span>
          <span>{{point.marker.getPosition().lat().toFixed(3)}}; {{point.marker.getPosition().lng().toFixed(3)}}</span>
        </div>
      </div>
      <div class="group" v-if="hasUngroupedPoints">
        <button>ungrouped</button>
        <div v-for="point in ungroupedPoints" :key="point.id">
          <span class="point-name">{{point.name}}</span>
          <span>{{point.marker.getPosition().lat().toFixed(3)}}; {{point.marker.getPosition().lng().toFixed(3)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {EventBus} from "../js/Event";
export default {
  name: "Sidebar",
  data() {
    return {
      groups: [],
      ungroupedPoints: []
    }
  },
  computed: {
    hasUngroupedPoints() {
      return !!Object.values(this.ungroupedPoints).length;
    }
  },
  mounted() {
    EventBus.$on("grouping", ({groups, ungrouped}) => {
      this.groups = groups;
      this.ungroupedPoints = Object.values(ungrouped);
    });
  }
}
</script>

<style lang="scss" scoped>
.group {
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1rem;
  margin-bottom: 10px;
  button {
    background-color: transparent;
    padding: 10px 20px 5px 0;
    outline: 0;
    border: 0;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-block;
  }
}
.point-name {
  font-weight: 700;
  margin-right: 10px
}
</style>