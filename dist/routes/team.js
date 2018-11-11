"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamService_1 = __importDefault(require("../services/teamService"));
const matchService_1 = __importDefault(require("../services/matchService"));
const playerService_1 = __importDefault(require("../services/playerService"));
const router = express_1.default.Router();
const teamService = new teamService_1.default();
const matchService = new matchService_1.default();
const playerService = new playerService_1.default();
router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.body);
    teamService.createTeam(req, res);
}));
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const teams = yield teamService.getAllTeams();
    res.send(teams);
}));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield teamService.getTeam(req.params.id, res);
}));
router.get("/:id/players", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield playerService.getPlayersWithGivenTeam(req.params.id, res);
}));
router.get("/:id/matches/upcoming", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const matches = yield matchService.getUpcomingMatchesForTeam(req.params.id);
    res.send(matches);
}));
router.get("/:id/matches/played", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const matches = yield matchService.getPlayedMatchesForTeam(req.params.id);
    res.send(matches);
}));
router.get("/:id/statistics", (req, res) => __awaiter(this, void 0, void 0, function* () { }));
router.put("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield teamService.updateTeamFromRequest(req, res);
}));
router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield teamService.deleteTeamWithGivenID(req, res);
}));
exports.default = router;
//# sourceMappingURL=team.js.map