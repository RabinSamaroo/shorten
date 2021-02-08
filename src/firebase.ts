// Handle DB connections and methods
//const admin = require("firebase-admin");
import * as admin from "firebase-admin";
import { ServerResponse } from "http";
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

const create = async function create(key: string, value: string) {
  const docRef = collection.doc(key);
  const document = await docRef.get();
  const data = { key: key, value: value };

  if (!document.exists) {
    await docRef.set(data);
    return data; // Document updated, returns data
  } else {
    return; // Document does not exist, returns nothing
  }
};

const update = async function update(key: string, value: string) {
  const docRef = collection.doc(key);
  const document = await docRef.get();
  const data = {key: key, value: value};
  if (!document.exists) {
    return; // Document does not exist
  } else {
    await docRef.set(data);
    return data; // Document updated
  }
};

let db = { read, create, update };
export { db as default };
