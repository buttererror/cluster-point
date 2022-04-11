class Group {
  points = [];
  id = "";
  color = "";
  constructor(point1, point2, id, color) {
    this.name = "g" + id;
    this.id = id;
    this.add(point1)
    this.add(point2)
    this.color = color
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get polygon() {
    return this._polygon;
  }
  set polygon(value) {
    this._polygon = value;
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
  static generateUniqueColor(colors) {
    let color = Math.floor(Math.random()*16777215).toString(16);
    if (colors.includes(color)) {
        this.generateUniqueColor(colors);
    }
    return "#" + color;
  }
}

export default Group;