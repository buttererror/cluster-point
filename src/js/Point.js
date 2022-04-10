class Point {
  isInGroup = false;
  id = "";
  marker = "";
  constructor(id, marker) {
    this.id = id;
    this.marker = marker;
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

}

export default Point;