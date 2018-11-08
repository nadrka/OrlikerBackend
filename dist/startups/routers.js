"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("../routes/player"));
const express_1 = __importDefault(require("express"));
const genres_1 = __importDefault(require("../routes/genres"));
const auth_1 = __importDefault(require("../routes/auth"));
const users_1 = __importDefault(require("../routes/users"));
function addRouters(app) {
    app.use(express_1.default.json());
    app.use("/api/auth", auth_1.default);
    app.use("/api/genres", genres_1.default);
    app.use("/api/players", player_1.default);
    app.use("/api/users", users_1.default);
}
exports.default = addRouters;
//# sourceMappingURL=routers.js.map