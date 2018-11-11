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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const matchResult_1 = require("./../models/match/matchResult");
const match_1 = __importDefault(require("../models/match/match"));
const loadash = __importStar(require("lodash"));
class MatchService {
    createMatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = match_1.default.validateMatch(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const match = yield matchRepository.create(req.body);
            res.send(match);
        });
    }
    createMatchResult(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const match = yield matchRepository.findOne({ id: req.params.id });
            if (!match)
                return res.status(400).send("Match for given id does not exist!");
            const { error } = matchResult_1.MatchResult.validateMatchResult(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
            const matchResultRepository = yield typeorm_1.getConnection().getRepository(matchResult_1.MatchResult);
            const matchResult = yield matchResultRepository.create(req.body);
            match.result = loadash.head(matchResult);
            res.send(matchResult);
        });
    }
    getMatchForGivenID(matchID, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const match = yield matchRepository.findOne({ id: matchID });
            if (!match)
                return res.status(400).send("Match for given id does not exist!");
            res.send(match);
        });
    }
    getUpcomingMatchesForTeam(teamID) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const upcomingMatches = yield matchRepository
                .createQueryBuilder("match")
                .where("match.homeTeamId = :id", { id: teamID })
                .orWhere("match.awayTeamId = :id", { id: teamID })
                .andWhere("match.status = :status", { status: "Upcoming" })
                .getMany();
            return upcomingMatches;
        });
    }
    getPlayedMatchesForTeam(teamID) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const playedMatches = yield matchRepository
                .createQueryBuilder("match")
                .where("match.homeTeamId = :id", { id: teamID })
                .orWhere("match.awayTeamId = :id", { id: teamID })
                .andWhere("match.status = :status", { status: "Played" })
                .getMany();
            return playedMatches;
        });
    }
    getUpcomingMatchesForLeague(league) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            let upcomingMatches = yield matchRepository.find({
                league: league,
                status: "Upcoming"
            });
            return upcomingMatches;
        });
    }
    getPlayedMatchesForLeague(league) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            let playedMatches = yield matchRepository.find({
                league: league,
                status: "Played"
            });
            return playedMatches;
        });
    }
    getMatchResult(matchResultID) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchResultRepository = yield typeorm_1.getConnection().getRepository(matchResult_1.MatchResult);
            const matchResult = yield matchResultRepository.findOne({
                id: matchResultID
            });
            return matchResult;
        });
    }
    updateMatch(match) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection().manager.save(match);
            return match;
        });
    }
    updateMatchWithRequestBody(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const match = yield matchRepository.findOne({ id: req.params.id });
            if (!match)
                return res.status(400).send("Match for given id does not exist!");
            const reqBody = req.body;
            loadash.merge(match, reqBody);
            res.send(match);
        });
    }
    updateMatchResult(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const match = yield matchRepository.findOne({ id: req.params.id });
            if (!match)
                return res.status(400).send("Match for given id does not exist!");
            if (!match.result)
                return res.status(400).send("This match does not have any result yet!");
            loadash.merge(match.result, req.body);
            res.send(match.result);
        });
    }
    deleteMatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const match = yield matchRepository.findOne({ id: req.params.id });
            if (!match)
                return res.status(404).send("Match with given id does not exist");
            yield typeorm_1.getConnection().manager.remove(match);
        });
    }
}
exports.default = MatchService;
//# sourceMappingURL=matchService.js.map