<template>
  <div id="map"></div>
</template>

<script>
export default {
  name: "Map",
  data() {
    return {
      id: 1,
      markers: [],
      distances: {}
    }
  },
  computed: {
    map() {
      /* eslint-disable no-undef */
      return new google.maps.Map(
          document.getElementById('map'),
          {zoom: 6, center: {lat: 23.8859, lng: 45.0792}}
      );
    }
  },
  mounted() {
    google.maps.event.addListener(this.map, "click", (event) => {
      this.addMarker(event.latLng, this.map);
    });
  },
  methods: {
    addMarker(location, map) {
      // Add the marker at the clicked location, and add the next-available label
      // from the array of alphabetical characters.
      let marker = new google.maps.Marker({
        position: location,
        label: this.id++ + "",
        map,
      });
      this.markers.push(marker)
      if(this.markers.length > 1) {
        for(let holdPoint of this.markers) {
          let holdPointPosition = holdPoint.getPosition();
          let holdPointNumber = Number(holdPoint.getLabel());
          for(let portablePoint of this.markers) {
            let portablePointPosition = portablePoint.getPosition();
            let portablePointNumber = Number(portablePoint.getLabel());
            if(holdPointNumber >= portablePointNumber) continue;
            let distanceKM = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(holdPointPosition, portablePointPosition) / 1000);
            this.distances[holdPointNumber + ":" + portablePointNumber] = distanceKM;
          }
        }
        console.log(this.distances)
      }
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