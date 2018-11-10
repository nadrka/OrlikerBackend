"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("../routes/player"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../routes/auth"));
const users_1 = __importDefault(require("../routes/users"));
const team_1 = __importDefault(require("../routes/team"));
const matches_1 = __importDefault(require("../routes/matches"));
const league_1 = __importDefault(require("../routes/league"));
function addRouters(app) {
    app.use(express_1.default.json());
    app.use("/api/auth", auth_1.default);
    app.use("/api/leagues", league_1.default);
    app.use("/api/matches", matches_1.default);
    app.use("/api/players", player_1.default);
    app.use("/api/teams", team_1.default);
    app.use("/api/users", users_1.default);
}
exports.default = addRouters;
//# sourceMappingURL=routers.js.map