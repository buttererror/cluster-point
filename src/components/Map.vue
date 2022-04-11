<template>
  <div id="map"></div>
</template>

<script>
import Group from "../js/Group";
import Point from "../js/Point";
import {EventBus} from "../js/Event";

export default {
  name: "Map",
  data() {
    /* eslint-disable no-undef */
    return {
      points: [],
      distances: {},
      groups: {},
      maxDistance: 0,
      ungroupedPoints: {},
      id: 0,
      pointDefaultColor: "#656668"
    }
  },
  computed: {
    map() {
      return new google.maps.Map(
          document.getElementById('map'),
          {zoom: 8, center: {lat: 51.1657, lng: 10.4515}}
      );
    },
    ruleDistance() {
      return this.maxDistance / 4;
    },
    groupsColors() {
      return Object.values(this.groups).map(x => x.color);
    },
    isToBuildGroups() {
      return this.points.length > 8
    }
  },
  mounted() {
    google.maps.event.addListener(this.map, "click", (event) => {
      this.addPoint(event.latLng, this.map).then((point) => {
        this.points.push(point);
        this.ungroupedPoints[point.id] = point;
        EventBus.$emit("add-point", this.ungroupedPoints);
        if (this.isToBuildGroups) {
          this.calculateDistances();
          this.buildGroups();
          this.drawGroupsPolygons();
          EventBus.$emit("build-groups", {groups: this.groups, ungrouped: this.ungroupedPoints})
        }
      });
    });
  },
  methods: {
    generateGroupId() {
      return this.id++;
    },
    buildGroups() {
      for (let twoPoints in this.distances) {
        let point1 = this.points[twoPoints.split(":")[0]]
        let point2 = this.points[twoPoints.split(":")[1]]
        if (this.distances[twoPoints] >= this.ruleDistance || point1.isInSameGroup(point2)) {
          continue;
        }
        if (!point1.isInGroup() && !point2.isInGroup()) {
          let group = new Group(point1, point2, this.generateGroupId(), Group.generateUniqueColor(this.groupsColors));
          delete this.ungroupedPoints[point1.id];
          delete this.ungroupedPoints[point2.id];
          this.groups[group.id] = group;
          continue;
        }
        if (!point1.isInGroup() && point2.isInGroup()) {
          point2.group.addPoint(point1);
          delete this.ungroupedPoints[point1.id];
          continue;
        }
        if (!point2.isInGroup() && point1.isInGroup()) {
          point1.group.addPoint(point2);
          delete this.ungroupedPoints[point2.id];
          continue;
        }
        let point2GroupId = point2.group.id;
        let point2GroupPolygon = point2.group.polygon;
        point1.group.concatGroup(point2.group);
        this.removePolygon(point2GroupPolygon);
        delete this.groups[point2GroupId];
      }
    },
    removePolygon(polygon) {
      if (polygon) {
        polygon.setMap(null);
      }
    },
    drawGroupsPolygons() {
      for (let id in this.groups) {
        let group = this.groups[id];
        this.removePolygon(group.polygon);
        group.drawPolygon(this.map);
      }
    },
    calculateDistances() {
      this.maxDistance = 0;
      for (let holdPointIndex = 0; holdPointIndex < this.points.length; holdPointIndex++) {
        let holdPoint = this.points[holdPointIndex];
        let holdPointPosition = holdPoint.marker.getPosition();
        for (let portablePointIndex = holdPointIndex + 1; portablePointIndex < this.points.length; portablePointIndex++) {
          let portablePoint = this.points[portablePointIndex];
          let portablePointPosition = portablePoint.marker.getPosition();
          let distanceKM = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(holdPointPosition, portablePointPosition) / 1000);
          this.distances[holdPoint.id + ":" + portablePoint.id] = distanceKM;
          if (distanceKM > this.maxDistance) {
            this.maxDistance = distanceKM;
          }
        }
      }
    },
    addPoint(location, map) {
      // point = {
      //   id: Number,
      //   name: String,
      //   group: Group instance,
      //   marker: Object
      // }
      return new Promise((resolve) => {
        let id = Point.generatePointId(this.points);
        let marker = new google.maps.Marker({
          position: location,
          // label: id + "",
          icon: Point.changeShapeColor(this.pointDefaultColor),
          map,
        });
        let point = new Point(id, marker);
        resolve(point);
      });
    }
  }
}
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
  border-radius: 10px;
}

</style>