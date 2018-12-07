import express from "express";
import config from "config";
import "reflect-metadata";
import startDatabase from "./startups/db";
import addRouters from "./startups/routers";

if (!config.get("jwtPrivateKey")) {
  console.log("Private key is not defined!");
  process.exit(1);
}
const app = express();

startDatabase();
addRouters(app);
app.use("/uploads", express.static("uploads"));
app.listen(3000, () => console.log("Example app listening on port 3000!"));
