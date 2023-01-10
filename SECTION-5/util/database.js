const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://adminluka:wDxbjqiP0HBjtqfpjUI0@nodejsudemycluster.dn5jdsr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let _db;

const mongoConnect = (callback) => {
  client
    .connect()
    .then((client) => {
      console.log("Connected to MongoDB!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No databse found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
