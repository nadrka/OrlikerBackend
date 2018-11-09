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
const match_1 = __importDefault(require("../models/match/match"));
// var loadash = require("lodash");
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
    createMatchResult(matchID) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getUpcomingMatches(team) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const upcomingMatches = yield matchRepository
                .createQueryBuilder("match")
                .where("match.homeTeam = :team", { team: team })
                .orWhere("match.awayTeam = :team", { team: team })
                .andWhere("match.status = :status", { status: "Upcoming" })
                .getMany();
            return upcomingMatches;
        });
    }
    getPlayedMatches(team) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            const playedMatches = yield matchRepository
                .createQueryBuilder("match")
                .where("match.homeTeam = :team", { team: team })
                .orWhere("match.awayTeam = :team", { team: team })
                .andWhere("match.status = :status", { status: "Played" })
                .getMany();
            return playedMatches;
        });
    }
    getUpcomingMatchesForLeague(league) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            let upcomingMatches = yield matchRepository.find({ league: league });
            upcomingMatches = upcomingMatches.filter(match => {
                match.status == "Upcoming";
            });
            return upcomingMatches;
        });
    }
    getPlayedMatchesForLeague(league) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchRepository = yield typeorm_1.getConnection().getRepository(match_1.default);
            let playedMatches = yield matchRepository.find({ league: league });
            playedMatches = playedMatches.filter(match => {
                match.status == "Played";
            });
            return playedMatches;
        });
    }
    updateMatch(match) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateMatchResult(matchID, matchResult) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    deleteMatch(matchID) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = MatchService;
//# sourceMappingURL=matchService.js.map