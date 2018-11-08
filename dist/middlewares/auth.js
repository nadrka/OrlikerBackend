"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function auth(req, res, next) {
    const token = req.header("auth-token");
    if (!token)
        res.status(401).send("Access denied. No token provided");
    try {
        jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        next();
    }
    catch (exepction) {
        res.status(400).send("Invalid token.");
    }
}
exports.default = auth;
//# sourceMappingURL=auth.js.map