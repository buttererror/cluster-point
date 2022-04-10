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
  #names = ["Thor", "Loki", "Iron Man", "Doctor Strange", "Spider Man", "Captain America"];
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
}

export default Point;