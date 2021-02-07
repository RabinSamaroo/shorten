const db = require("./firebase.js");
const { nanoid } = require("nanoid");
const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT || 8888;
const RANDOM_LENGTH = 6;
const VALIDATOR = new RegExp("^[A-Za-z0-9_-]{1,32}$");

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./public/docs/openapi.json');
app.use('/docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/:shortlink([A-Za-z0-9_-]{1,32})", function (req, res) {
  const reqType = req.headers["accept"];
  db.read(req.params.shortlink).then(
    function (doc) {
      reqType == "application/json" // Handle json req types
        ? res.send(doc)
        : res.redirect(doc.data.value);
    },
    function (error) {
      console.log(error);
    }
  );
});

app.post("/new", function (req, res) {
  //TODO validate inputs
  const key = req.body.key || nanoid(RANDOM_LENGTH); // Check for key or randomize
  !VALIDATOR.test(key) // Valid test
    ? res.send(JSON.stringify({ status: 400, data: {} })) // Key is not valid
    : db.create(key, req.body.value).then(
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
