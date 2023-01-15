const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");

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
app.use(cookieParser("cookie-parser-secret-437289424"));
app.use(
  session({
    secret: "my secret long string value lalala",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  req.test = "I am set";
  next();
});
app.use((req, res, next) => {
  console.log("I am ran");
  next();
});
app.use(csrf("123456789iamasecrethfjsneuchlook"));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    console.log("isLoggedIn, yes");
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("isNotLoggedIn, no");
    next();
  }
});

app.use((req, res, next) => {
  console.log(req.test);
  if (req.method === "GET") res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(miscController.get404);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
