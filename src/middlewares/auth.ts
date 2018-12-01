import config from "config";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { Response, NextFunction } from "express-serve-static-core";

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) res.sendStatus(403);
  try {
    let decoded: any = jwt.verify(token, config.get("jwtPrivateKey"));
    res.locals.senderId = decoded.id;
    next();
  } catch (exepction) {
    res.sendStatus(403);
  }
}

export default auth;
