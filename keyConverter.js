import fs from "fs";
const key = fs.readFileSync(
  "./fireBaseSDK/karamplate-firebase-adminsdk-fbsvc-16f0c683fb.json",
  "utf-8",
);
const base64 = Buffer.from(key).toString("base64");
console.log(base64);
