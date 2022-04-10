<template>
  <div class="sidebar">
    <h1>
      Groups
    </h1>
    <div>
      <div v-for="group in groups" :key="group.id" class="group">
        <div class="group-title">
          <input type="color" :id="group.id" :value="group.color">
          <label :for="group.id">Group</label>
        </div>
        <div v-for="point in group.points" :key="point.id">
          <div class="space"></div>
          <span class="point-name">{{point.name}}</span>
          <span>{{point.marker.getPosition().lat().toFixed(3)}}; {{point.marker.getPosition().lng().toFixed(3)}}</span>
        </div>
      </div>
      <div class="group" v-if="hasUngroupedPoints">
        <div class="group-title">
          <div class="space"></div>
          <label>ungrouped</label>
        </div>
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
      this.groups = Object.values(groups);
      this.ungroupedPoints = Object.values(ungrouped);
    });
  }
}
</script>

<style lang="scss" scoped>
@mixin space($width, $height) {
  width: #{$width};
  height: #{$height};
  margin-right: 10px;
  background-color: transparent;
  display: inline-block;
}

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

.group-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 85px;
  input[type="color"] {
    @include space(25px, 25px);
    border: 0;
    cursor: pointer;
  }
  label {
    font-weight: 600;
    line-height: 25px;
    vertical-align: middle;
    cursor: pointer;
  }
}
.space {
  @include space(25px, 18px);
}
</style>