const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const miscController = require("./controllers/misc");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://adminluka:wDxbjqiP0HBjtqfpjUI0@cluster0.iqwepvj.mongodb.net/shop";

const app = express();
const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARES - these run when we get incomming request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret long string value lalala",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// app.use((req, res, next) => {
//   User.findById("63c137193bd71229a1bd674a")
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(miscController.get404);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: "luka",
          email: "luka.ernestini@gmail.com",
          cart: {
            items: [],
          },
          orders: [],
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
