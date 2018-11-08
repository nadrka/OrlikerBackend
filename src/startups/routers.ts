import player from "../routes/player";
import { Express } from "express";
import express from "express";
import genre from "../routes/genres";
import auth from "../routes/auth";
import user from "../routes/users";

function addRouters(app: Express) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/genres", genre);
  app.use("/api/players", player);
  app.use("/api/users", user);
}

export default addRouters;
