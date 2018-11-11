"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const loadash = __importStar(require("lodash"));
const league_1 = require("../models/league");
class LeagueService {
    createLeague(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = league_1.League.validateLeague(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
            const leagueRepository = yield typeorm_1.getConnection().getRepository(league_1.League);
            const league = yield leagueRepository.create(req.body);
            yield typeorm_1.getConnection().manager.save(league);
            return league;
        });
    }
    getLeagues() {
        return __awaiter(this, void 0, void 0, function* () {
            const leagues = yield typeorm_1.getConnection().manager.find(league_1.League);
            return leagues;
        });
    }
    updateLeague(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const leagueRepository = yield typeorm_1.getConnection().getRepository(league_1.League);
            const league = yield leagueRepository.findOne({ id: req.params.id });
            if (!leagueRepository)
                return res.status(404).send("League with given id does not exist");
            loadash.merge(league, req.body);
            yield typeorm_1.getConnection().manager.save(league);
            res.send(league);
        });
    }
    deleteLeagueWithGivenID(req, res, leagueID) {
        return __awaiter(this, void 0, void 0, function* () {
            const leaguesRepository = yield typeorm_1.getConnection().getRepository(league_1.League);
            const league = yield leaguesRepository.findOne({ id: leagueID });
            if (!league)
                return res.status(404).send("League with given id does not exist");
            yield typeorm_1.getConnection().manager.remove(league);
        });
    }
}
exports.default = LeagueService;
//# sourceMappingURL=leagueService.js.map