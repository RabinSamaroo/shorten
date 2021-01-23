// Handle DB connections and methods
const admin = require("firebase-admin");
const serviceAccount = require("./SERVICE_ACCOUNT.json");
const collection = "urls";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore().collection(collection);

module.exports.read = async function read(key) {
  const document = await db.doc(key).get();
  if (!document.exists) {
    return { status: 404 };
  } else {
    return document.data();
  }
};

module.exports.create = async function create(key, value) {
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
};

module.exports.update = async function update(key, value) {
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
};

module.exports.delete_document = async function delete_document(key) {
  const document = await db.doc(key).delete();
  return { status: "deleted" };
};
