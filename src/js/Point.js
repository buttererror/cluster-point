class Point {
  isInGroup = false;
  id = "";
  marker = "";
  name = "";
  constructor(id, marker) {
    this.id = id;
    this.marker = marker;
    this.name = this.#generateRandomName();
  }
  #names = ["Thor", "Loki", "Iron Man", "Doctor Strange", "Spider Man", "Captain America", "Batman", "Cat woman"];
  #generateRandomName() {
    return this.#names[Math.floor(Math.random() * this.#names.length)]
  }
  get group () {
    return this._group;
  }
  set group(value) {
    this.isInGroup = true;
    this._group = value;
  }
  isInSameGroup(point) {
    return this.group.name === point.group.name;
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