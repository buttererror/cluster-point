<template>
  <div class="sidebar">
    <h1>
      Groups
    </h1>
    <div>
      <div v-for="group in groups" :key="group.id" class="group">
        <div class="group-title" @click="groupClicked(group)">
          <input type="color" :id="group.id"
                 :value="group.color" @input="changePolygonColor">
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
          <div class="space"></div>
          <span class="point-name">{{point.name}}</span>
          <span>{{point.marker.getPosition().lat().toFixed(3)}}; {{point.marker.getPosition().lng().toFixed(3)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {EventBus} from "../js/Event";
import Point from "../js/Point";
export default {
  name: "Sidebar",
  data() {
    return {
      groups: [],
      ungroupedPoints: [],
      group: {}
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
  },
  methods: {
    groupClicked(group) {
      this.group = group;
    },
    changePolygonColor(e) {
      let color = e.target.value;
      this.group.polygon.setOptions({
        strokeColor: color,
        fillColor: color,
      });
      for(let point of this.group.points) {
        point.marker.setIcon(Point.changeShapeColor(color))
      }
    }
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
  width: 120px;
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