const { getDb } = require("../util/database");
const mongodb = require("mongodb");
const collName = "users";

class User {
  constructor(username, email, id = null) {
    this.username = username;
    this.email = email;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection(collName)
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection(collName).insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchById(id) {
    const db = getDb();
    return db
      .collection(collName)
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
