import admin from "firebase-admin";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./devconnect.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://devconnect-27473-default-rtdb.firebaseio.com" // Needed if using Realtime Database
});

const db = admin.firestore(); // If using Firestore
const auth = admin.auth(); // For Authentication

export { admin, db, auth };
