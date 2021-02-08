// Handle DB connections and methods
//const admin = require("firebase-admin");
import * as admin from "firebase-admin";
const serviceAccount = require("../SERVICE_ACCOUNT.json");
const collectionName = "urls";


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const collection = admin.firestore().collection(collectionName);

const read = async function read(key: string) {
  const document = await collection.doc(key).get();
  if (document.exists) {
    return document.data(); // Document found
  }
  return; // Document not found
};

let db = { read };
export { db as default };
