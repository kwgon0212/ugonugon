import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

import serviceAccountKey from "../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as ServiceAccount),
  storageBucket: "payrunner-d2f70.firebasestorage.app",
});

const bucket = admin.storage().bucket();

export { bucket };
