import player from "../routes/player";
import { Express } from "express";
import express from "express";
import auth from "../routes/auth";
import user from "../routes/users";
import team from "../routes/team";

function addRouters(app: Express) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/players", player);
  app.use("/api/teams", team);
  app.use("/api/users", user);
}

export default addRouters;
