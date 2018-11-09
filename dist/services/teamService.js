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
const typeorm_1 = require("typeorm");
const team_1 = __importDefault(require("../models/team/team"));
class TeamService {
    createTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = team_1.default.validateTeam(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
            const teamRepository = yield typeorm_1.getConnection().getRepository(team_1.default);
            const teamFromRequestBody = req.body;
            const team = yield teamRepository.create(teamFromRequestBody);
            yield typeorm_1.getConnection().manager.save(team);
            res.send(team);
        });
    }
    getTeamsForGivenLeague() {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepository = yield typeorm_1.getConnection().getRepository(team_1.default);
        });
    }
    deletePlayerWithGivenID(req, res, playerID) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamsRepository = yield typeorm_1.getConnection().getRepository(team_1.default);
            const team = yield teamsRepository.findOne({ id: req.params.id });
            if (!team)
                return res.status(404).send("Team with given id does not exist");
            yield typeorm_1.getConnection().manager.remove(team);
        });
    }
}
exports.default = TeamService;
//# sourceMappingURL=teamService.js.map