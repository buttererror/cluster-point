import Point from "./Point";

class Group {
  points = [];
  id = null;
  color = null;
  name = null;
  polygon = null;
  constructor(point1, point2, id, color) {
    this.name = "g" + id;
    this.id = id;
    this.add(point1)
    this.add(point2)
    this.color = color
  }
  add(point) {
    point.group = this;
    this.points.push(point);
  }
  concat(group) {
    for(let point of group.points) {
      this.add(point);
    }
  }

  drawPolygon(map) {
    let polygonAsLatLngLiteral = this.points.map((point) => {
      point.marker.setIcon(Point.changeShapeColor(this.color));
      point = point.marker.getPosition();
      return point;
    });
    /* eslint-disable no-undef */
    let polygon = new google.maps.Polygon({
      strokeColor: this.color,
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: this.color,
      fillOpacity: 0.35
    });
    this.polygon = polygon;
    polygon.setMap(map)
    polygon.setPaths(polygonAsLatLngLiteral)
}

  static generateUniqueColor(colors) {
    let color = Math.floor(Math.random()*16777215).toString(16);
    if (colors.includes(color)) {
        this.generateUniqueColor(colors);
    }
    return "#" + color;
  }
}

export default Group;