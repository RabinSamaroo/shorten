// Handle DB connections and methods
const admin = require("firebase-admin");
const serviceAccount = require("./SERVICE_ACCOUNT.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore().collection("urls");

async function read(key) {
  const document = await db.doc(key).get();
  if (!document.exists) {
    return { status: 404 };
  } else {
    return document.data();
  }
}

async function create(key, value) {
  const docRef = db.doc(key);
  const document = await docRef.get();
  if (!document.exists) {
    await docRef.set({
      key: key,
      value: value,
    });
    return { status: "shortened url created" };
  } else {
    return { status: "document already exists" }; //Document already exists
  }
}

async function update(key, value) {
  const docRef = db.doc(key);
  const document = await docRef.get();
  if (!document.exists) {
    return { status: "shortened url does not exist" };
  } else {
    await docRef.set({
      key: key,
      value: value,
    });
    return { status: "updated" };
  }
}
/*
async function delete_document(key) {
  const document = await db.doc(key).delete();
  return { status: "shortened url deleted" };
}
*/

// Express server starts here ~~~~~~~~~~~~~~~~~~~~

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/:shortlink", function (req, res) {
  read(req.params.shortlink).then(
    function (value) {
      res.send(JSON.stringify(value));
    },
    function (error) {
      console.log(error);
    }
  );
});

app.post("/:shortlink", function (req, res) {
  create(req.params.shortlink, req.body.value).then(
    function (value) {
      res.send(JSON.stringify(value));
    },
    function (error) {
      console.log(error);
    }
  );
});

app.put("/:shortlink", function (req, res) {
  update(req.params.shortlink, req.body.value).then(
    function (value) {
      res.send(JSON.stringify(value));
    },
    function (error) {
      console.log(error);
    }
  );
});

/*
app.delete("/:shortlink", function (req, res) {
  delete_document(req.params.shortlink).then(
    function (value) {
      res.send(JSON.stringify(value));
    },
    function (error) {
      console.log(error);
    }
  );
});
*/
app.listen(3000);
