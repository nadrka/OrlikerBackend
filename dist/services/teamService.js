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
            const teamWithName = yield teamRepository.find({
                name: teamFromRequestBody.name
            });
            if (teamWithName)
                return res.status(400).send("Team with given name already exists!");
            const team = yield teamRepository.create(teamFromRequestBody);
            yield typeorm_1.getConnection().manager.save(team);
            res.send(team);
        });
    }
    getTeamsForGivenLeague(leagueID) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepository = yield typeorm_1.getConnection().getRepository(team_1.default);
            const teams = yield teamRepository.find({ currentLegueId: leagueID });
            return teams;
        });
    }
    getAllTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepository = yield typeorm_1.getConnection().getRepository(team_1.default);
            const teams = yield teamRepository.find();
            return teams;
        });
    }
    getTeam(teamID, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepository = yield typeorm_1.getConnection().getRepository(team_1.default);
            const team = yield teamRepository.findOne({ id: teamID });
            if (team)
                return res.status(400).send("Team with given id does not exists!");
            res.send(team);
        });
    }
    updateTeam(team) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection().manager.save(team);
        });
    }
    updateTeamFromRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamsRepository = yield typeorm_1.getConnection().getRepository(team_1.default);
            const team = yield teamsRepository.findOne({ id: req.params.id });
            if (!team)
                return res.status(404).send("Team with given id does not exist");
            const teamWithName = yield teamsRepository.findOne({ name: req.body.name });
            if (teamWithName)
                return res.status(404).send("Team with given name already exist");
            team.name = req.body.name;
            team.imgURL = req.body.imgURL;
            team.captainId = team.captainId;
            yield typeorm_1.getConnection().manager.save(team);
        });
    }
    deleteTeamWithGivenID(req, res) {
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