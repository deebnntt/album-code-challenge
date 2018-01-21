class User {
  constructor(attr) {
    this.title = attr.title
    this.userId = attr.userId

    User.all.push(this)
  }

}

User.all = []
