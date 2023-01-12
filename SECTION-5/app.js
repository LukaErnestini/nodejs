const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const miscController = require("./controllers/misc");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARES - these run when we get incomming request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.fetchById("63be82e9be8dd418a0c577d8")
  //   .then((user) => {
  //     req.user = User.build(user);
  //     // so that we have the user available on all requests

  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(miscController.get404);
mongoose
  .connect(
    "mongodb+srv://adminluka:wDxbjqiP0HBjtqfpjUI0@nodejsudemycluster.dn5jdsr.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
