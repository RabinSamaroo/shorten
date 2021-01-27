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
    return { status: 404, data: {} }; // Document not found
  } else {
    return { status: 200, data: document.data() }; // Document found
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
    return { status: 201, data: {} }; // Document created
  } else {
    return { status: 409, data: {} }; // Document already exists
  }
};

module.exports.update = async function update(key, value) {
  const docRef = db.doc(key);
  const document = await docRef.get();
  if (!document.exists) {
    return { status: 404, data: {} }; // Document does not exist
  } else {
    await docRef.set({
      key: key,
      value: value,
    });
    return { status: 200, data: {} }; // Document updated
  }
};

module.exports.delete_document = async function delete_document(key) {
  const document = await db.doc(key).delete();
  return { status: 200, data: {} }; // Document deleted
};
