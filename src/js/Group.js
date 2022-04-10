class Group {
  points = [];
  id = "";
  constructor(point1, point2, id) {
    this.name = "g" + id;
    this.id = id;
    this.add(point1)
    this.add(point2)
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  add(point) {
    point.group = this;
    this.points.push(point);
  }
  concat(group) {
    console.log("this", this)
    console.log("group", group.points)
    for(let point of group.points) {
      console.log("point", point)
      this.add(point);
    }
    console.log("concated", this.points)
  }

  static generateGroupId(groups) {
    return groups.length;
  }
}

export default Group;