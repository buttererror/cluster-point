<template>
  <div class="sidebar" :class="{'closed': canToggleSidebar}">
    <div class="sidebar-title">
      <div class="space"></div>
      <div>
        <h1>
          Groups
        </h1>
        <button @click="toggleSidebar" v-if="canToggleSidebar">
          <span v-if="isSidebarOpened">Close</span>
          <span v-else>Open</span>
        </button>
      </div>
    </div>
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
      group: {},
      windowWidth: 0,
      isSidebarOpened: false
    }
  },
  computed: {
    hasUngroupedPoints() {
      return !!Object.values(this.ungroupedPoints).length;
    },
    canToggleSidebar() {
      return this.windowWidth < 1200
    }
  },
  mounted() {
    this.windowWidth = window.innerWidth;
    console.log(this.windowWidth)
    window.onresize = () => {
      if(window.innerWidth >= 1200) {
        this.isSidebarOpened = false;
      }
      this.windowWidth = window.innerWidth;
    };
    EventBus.$on("grouping", ({groups, ungrouped}) => {
      this.groups = Object.values(groups);
      this.ungroupedPoints = Object.values(ungrouped);
    });
  },
  methods: {
    toggleSidebar() {
      if(this.isSidebarOpened) {
        document.querySelector(".sidebar").classList.add("closed");
        document.querySelector(".sidebar").classList.remove("opened");
        this.isSidebarOpened = false;
        return;
      }
      document.querySelector(".sidebar").classList.add("opened");
      document.querySelector(".sidebar").classList.remove("closed");
      this.isSidebarOpened = true;
    },
    groupClicked(group) {
      this.group = group;
    },
    changePolygonColor(e) {
      this.group.color = e.target.value;
      this.group.polygon.setOptions({
        strokeColor: this.group.color,
        fillColor: this.group.color,
      });
      for(let point of this.group.points) {
        point.marker.setIcon(Point.changeShapeColor(this.group.color))
      }
    }
  },
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
.sidebar {
  position: absolute;
  left: 0;
  z-index: 100000000000000;
  height: 100vh;
  background: #ffffff;
  box-shadow: -11px 28px 34px 0 rgba(0, 0, 0, 0.75);
  width: 300px;
  transition: all 0.2s ease-in;
  &.closed {
    transform: translateX(-300px);
    button {
      position: absolute;
      left: 310px;
      top: 60px;
    }
  }
  &.opened {
    transform: translateX(0);
  }
}
@media screen and (min-width: 1200px){
  .sidebar {
    position: relative;
    background: transparent;
    box-shadow: none;
    width: 30%;
  }
  .sidebar-title {
    justify-content: flex-start !important;
  }
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

.sidebar-title {
  display: flex;
  > div:last-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
    width: 100%;
  }

  button {
    background: #000000;
    border: 0;
    cursor: pointer;
    font-weight: 600;
    height: 30px;
    border-radius: 3px;
    color: #ffffff;
    transition: all 0.2s ease-in;
  }
}
</style>