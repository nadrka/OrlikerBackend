import player from "../routes/player";
import { Express } from "express";
import express from "express";
import auth from "../routes/auth";
import user from "../routes/users";
import team from "../routes/team";
import matches from "../routes/matches";
import invitations from "../routes/invitations";
import playerStatistic from "../routes/playerStatistic";
import League from "../routes/league";
import news from "../routes/news";

function addRouters(app: Express) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/invitations", invitations);
  app.use("/api/leagues", League);
  app.use("/api/matches", matches);
  app.use("/api/players", player);
  app.use("/api/statistics", playerStatistic);
  app.use("/api/teams", team);
  app.use("/api/users", user);
  app.use("/api/news", news);
}

export default addRouters;
