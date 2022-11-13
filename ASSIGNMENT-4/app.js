const path = require("path");
const app = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.Request((req, res, next) => {
  //TODO
});
app.listen(3000);
