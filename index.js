// Express server starts here ~~~~~~~~~~~~~~~~~~~~
const db = require("./firebase.js");
const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8888;

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/:shortlink", function (req, res) {
  db.read(req.params.shortlink).then(
    function (value) {
      res.send(JSON.stringify(value));
    },
    function (error) {
      console.log(error);
    }
  );
});

app.post("/:shortlink", function (req, res) {
  db.create(req.params.shortlink, req.body.value).then(
    function (value) {
      res.send(JSON.stringify(value));
    },
    function (error) {
      console.log(error);
    }
  );
});

app.put("/:shortlink", function (req, res) {
  db.update(req.params.shortlink, req.body.value).then(
    function (value) {
      res.send(JSON.stringify(value));
    },
    function (error) {
      console.log(error);
    }
  );
});

app.delete("/:shortlink", function (req, res) {
  db.delete_document(req.params.shortlink).then(
    function (value) {
      res.send(JSON.stringify(value));
    },
    function (error) {
      console.log(error);
    }
  );
});

app.listen(port);
console.log("Listining on http://127.0.0.1:" + port);

module.exports = app; // for testing
