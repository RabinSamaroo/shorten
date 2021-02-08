import db from "./firebase"; // Back end connection
import express from "express";
import nanoid from "nanoid";
import * as bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 8888;
const RANDOM_LENGTH = 6;
const VALIDATOR = new RegExp("^[A-Za-z0-9_-]{1,32}$");

// Serve swagger at /docs/
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../public/docs/openapi.json');
app.use('/docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// app.use(bodyParser.json());
app.use(express.static("public"));

class serverResponse {
  status: number;
  message: string;
  data: object;

  constructor(
    status: number,
    message: string,
    data: FirebaseFirestore.DocumentData | undefined
  ) {
    this.status = status;
    this.message = message;
    if (data) {
      this.data = data;
    } else {
      this.data = {};
    }
  }
}

app.get("/:shortlink([A-Za-z0-9_-]{1,32})", (req, res) => {
  const acceptJson = req.headers["accept"] == "application/json";
  db.read(req.params.shortlink).then(
    (data) => {
      if (acceptJson) {
        const response = data
          ? new serverResponse(200, "document found", data)
          : new serverResponse(404, "document not found", data);
        res.send(response);
      } else if (!acceptJson && data) {
        res.redirect(data.value);
      }
    },
    function (error: any) {
      console.log(error);
    }
  );
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

module.exports = app; // for testing