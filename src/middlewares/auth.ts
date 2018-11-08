import config from "config";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { Response, NextFunction } from "express-serve-static-core";

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("auth-token");
  if (!token) res.status(401).send("Access denied. No token provided");
  try {
    jwt.verify(token, config.get("jwtPrivateKey"));
    next();
  } catch (exepction) {
    res.status(400).send("Invalid token.");
  }
}

export default auth;
