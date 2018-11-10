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
const playerStatistic_1 = require("./../models/player/playerStatistic");
const typeorm_1 = require("typeorm");
const playerStatistic_2 = __importDefault(require("../models/player/playerStatistic"));
class PlayerStatisticService {
    createStatistic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = playerStatistic_2.default.validatePlayerStatistic(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
            const playerStatisticRepository = yield typeorm_1.getConnection().getRepository(playerStatistic_1.PlayerStatistic);
            const playerStatistic = yield playerStatisticRepository.create(req.body);
            res.send(playerStatistic);
        });
    }
    getStatisticsForTeam(matchID, teamID) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getStatisticsForPlayer(playerID) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getStatisticsForLeague(leagueID) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateStatistic() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    deleteStatistic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const playerStatisticRepository = yield typeorm_1.getConnection().getRepository(playerStatistic_1.PlayerStatistic);
            const playerStatistic = yield playerStatisticRepository.findOne({
                id: req.params.id
            });
            if (!playerStatistic)
                return res
                    .status(404)
                    .send("Player's statistic with given id does not exist");
            yield typeorm_1.getConnection().manager.remove(playerStatistic);
        });
    }
}
exports.default = PlayerStatisticService;
//# sourceMappingURL=playerStatisticService.js.map