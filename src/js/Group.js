class Group {
  points = [];
  id = "";
  color = "";
  constructor(point1, point2, id) {
    this.name = "g" + id;
    this.id = id;
    this.add(point1)
    this.add(point2)
    this.color = this.#generateUniqueColor();
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
  #colors = [];
  #generateUniqueColor() {
    let color = Math.floor(Math.random()*16777215).toString(16);
    if (this.#colors.includes(color)) {
      return this.#generateUniqueColor();
    }
    this.#colors.push(color);
    return "#" + color;
  }
}

export default Group;