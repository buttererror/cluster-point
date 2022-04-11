class Point {
  id = null;
  marker = null;
  name = null;
  group = null;
  constructor(id, marker) {
    this.id = id;
    this.marker = marker;
    this.name = this.#generateRandomName();
  }
  #names = ["Thor", "Loki", "Iron Man", "Doctor Strange", "Spider Man", "Captain America", "Batman", "Cat woman"];
  #generateRandomName() {
    return this.#names[Math.floor(Math.random() * this.#names.length)]
  }
  isInGroup() {
    return this.group !== null;
  }
  isInSameGroup(point) {
    if(this.group && point.group) {
      return this.group.name === point.group.name;
    }
    return false;
  }
  static generatePointId(points) {
    return points.length;
  }
  /* eslint-disable no-undef */
  static shape = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "white",
    fillOpacity: 1,
    strokeWeight: 4,
    rotation: 0,
    scale: 5,
  };
  static changeShapeColor(color) {
    this.shape.strokeColor = color;
    return this.shape;
  }
}

export default Point;