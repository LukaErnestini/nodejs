// const { getDb } = require("../util/database");
// const mongodb = require("mongodb");
// const { postCartDeleteProduct } = require("../controllers/shop");
// const _COLL_NAME = "users";

// class User {
//   constructor(username, email, cart = null, id = null) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection(_COLL_NAME)
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection(_COLL_NAME).insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.equals(product._id);
//     });
//     console.log(cartProductIndex);
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: product._id, quantity: newQuantity });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection(_COLL_NAME)
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   removeFromCart(id) {
//     const itemsAfter = this.cart.items.filter((i) => {
//       return i.productId.toString() !== id;
//     });
//     this.cart.items = itemsAfter;
//     return this.save();
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((item) => {
//       return item.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.username,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((response) => {
//         console.log(response);
//         this.cart = { items: [] };
//         return db
//           .collection(_COLL_NAME)
//           .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection("orders").find({ "user._id": this._id }).toArray();
//   }

//   static build(user) {
//     let cart = user.cart || null;
//     let _id = user._id || null;
//     return new User(user.username, user.email, cart, _id);
//   }

//   static fetchById(id) {
//     const db = getDb();
//     return db
//       .collection(_COLL_NAME)
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
