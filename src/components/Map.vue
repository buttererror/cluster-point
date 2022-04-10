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
      id: 0
    }
  },
  computed: {
    map() {
      return new google.maps.Map(
          document.getElementById('map'),
          {zoom: 6, center: {lat: 23.8859, lng: 45.0792}}
      );
    },
    ruleDistance() {
      return this.maxDistance / 4;
    }
  },
  mounted() {
    google.maps.event.addListener(this.map, "click", (event) => {
      this.addPoint(event.latLng, this.map);
      if (this.points.length > 8) {
        this.grouping();
        this.drawGroupsPolygons();
        EventBus.$emit("grouping", {groups: this.groups, ungrouped: this.ungroupedPoints})
      }
    });
  },
  methods: {
    generateGroupId() {
      return this.id++;
    },
    grouping() {
      for (let twoPoints in this.distances) {
        let point1 = this.points[twoPoints.split(":")[0]]
        let point2 = this.points[twoPoints.split(":")[1]]
        if (!point1.isInGroup) {
          this.ungroupedPoints[point1.id] = point1;
        }
        if (!point2.isInGroup) {
          this.ungroupedPoints[point2.id] = point2;
        }
        if (this.distances[twoPoints] >= this.ruleDistance) {
          continue;
        }
        if (!point1.isInGroup && !point2.isInGroup) {
          let group = new Group(point1, point2, this.generateGroupId());
          delete this.ungroupedPoints[point1.id];
          delete this.ungroupedPoints[point2.id];
          this.groups[group.id] = group;
          continue;
        }
        if (!point1.isInGroup && point2.isInGroup) {
          point2.group.add(point1);
          delete this.ungroupedPoints[point1.id];
          continue;
        }
        if (!point2.isInGroup && point1.isInGroup) {
          point1.group.add(point2);
          delete this.ungroupedPoints[point2.id];
          continue;
        }
        if (point1.isInGroup && point2.isInGroup && !point1.isInSameGroup(point2)) {
          let point2GroupId = point2.group.id;
          let point2GroupPolygon = point2.group.polygon;
          point1.group.concat(point2.group);
          this.removePolygon(point2GroupPolygon);
          delete this.groups[point2GroupId];
        }
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
        this.drawPolygon(group, this.map);
      }
    },
    calculateMaxDistance(distanceKM, previousMaxDistance) {
      this.maxDistance = distanceKM > previousMaxDistance ? distanceKM : previousMaxDistance;
      return this.maxDistance;
    },
    collectDistances() {
      let previousMaxDistance = 0;
      let distanceKM = 0;
      for (let holdPoint of this.points) {
        let holdPointPosition = holdPoint.marker.getPosition();
        for (let portablePoint of this.points) {
          let portablePointPosition = portablePoint.marker.getPosition();
          if (holdPoint.id >= portablePoint.id) continue;
          distanceKM = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(holdPointPosition, portablePointPosition) / 1000);
          this.distances[holdPoint.id + ":" + portablePoint.id] = distanceKM;
          previousMaxDistance = this.calculateMaxDistance(distanceKM, previousMaxDistance);
        }
      }
    },
    addPoint(location, map) {
      let id = Point.generatePointId(this.points);
      let marker = new google.maps.Marker({
        position: location,
        // label: id + "",
        icon: Point.changeShapeColor("grey"),
        map,
      });
      let point = new Point(id, marker);
      // point = {
      //   id: Number,
      //   name: String,
      //   group: Group instance,
      //   marker: Object
      // }
      this.points.push(point)
      if (this.points.length > 8) {
        this.maxDistance = 0;
        this.collectDistances();
      }
    },
    drawPolygon(group, map) {
      let polygonAsLatLngLiteral = group.points.map((point) => {
        point.marker.setIcon(Point.changeShapeColor(group.color));
        point = point.marker.getPosition();
        return point;
      });
      let polygon = new google.maps.Polygon({
        strokeColor: group.color,
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: group.color,
        fillOpacity: 0.35
      });
      group.polygon = polygon;
      polygon.setMap(map)
      polygon.setPaths(polygonAsLatLngLiteral)
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