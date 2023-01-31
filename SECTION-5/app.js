const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.iqwepvj.mongodb.net/${process.env.MONGO_DATABASE}`;

const app = express();
const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const fileFilter = (req, file, cb) => {
  const okTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (okTypes.includes(file.mimetype)) cb(null, true);
  else cb(null, false);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const accesLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// MIDDLEWARES - these run when we get incomming request
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accesLogStream }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(cookieParser("cookie-parser-secret-437289424"));
app.use(
  session({
    secret: "my secret long string value lalala",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf("123456789iamasecrethfjsneuchlook"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(flash());
app.use((req, res, next) => {
  //if (req.method === "GET")
  // EDITED THE MODULE TO MAKE THE BELOW LINE WORK ON ALL REQ METHODS
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.errorMessage = req.flash("error")[0];
  res.locals.infoMessage = req.flash("info")[0];
  next();
});

app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) return next();
        req.user = user;
        next();
      })
      .catch((err) => {
        next(new Error(err));
      });
  } else {
    next();
  }
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", errorController.get500);
app.use(errorController.get404);
// special express error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  res.render("error", {
    statusCode: 500,
    title: "Error",
    path: "",
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(process.env.port || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
