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
const player_1 = __importDefault(require("../models/player/player"));
const user_1 = __importDefault(require("../models/user"));
const loadash = __importStar(require("lodash"));
class PlayerService {
    createPlayer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = player_1.default.validatePlayer(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
            const playerRepository = yield typeorm_1.getConnection().getRepository(player_1.default);
            const player = yield playerRepository.create(req.body);
            return player;
        });
    }
    createPlayerForUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = new player_1.default();
            player.user = user;
            yield typeorm_1.getConnection().manager.save(player);
            return player;
        });
    }
    getAllPlayers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const players = yield typeorm_1.getConnection().manager.find(player_1.default);
            return players;
        });
    }
    getPlayerWithGivenID(req, res, playerID) {
        return __awaiter(this, void 0, void 0, function* () {
            const playersRepository = yield typeorm_1.getConnection().getRepository(player_1.default);
            const player = yield playersRepository.findOne({ id: playerID });
            if (!player)
                return res.status(404).send("Player with given id does not exist");
            return player;
        });
    }
    getPlayersWithGivenTeam(teamID, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const playersRepository = yield typeorm_1.getConnection().getRepository(player_1.default);
            const players = yield playersRepository.find({ teamId: teamID });
            if (players)
                return res.status(404).send("There is no player for given team!");
            res.send(players);
        });
    }
    getPlayerForUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = yield typeorm_1.getConnection().getRepository(user_1.default);
            const user = yield userRepository.findOne({ id: userID });
            const playerRepository = yield typeorm_1.getConnection().getRepository(player_1.default);
            const player = yield playerRepository.findOne({ user: user });
            return player;
        });
    }
    updatePlayerWith(player) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection().manager.save(player);
        });
    }
    updatePlayer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const playerRepository = yield typeorm_1.getConnection().getRepository(player_1.default);
            const player = yield playerRepository.findOne({ id: req.params.id });
            loadash.merge(player, req.body);
            yield typeorm_1.getConnection().manager.save(player);
            res.send(player);
        });
    }
    deletePlayerWithGivenID(req, res, playerID) {
        return __awaiter(this, void 0, void 0, function* () {
            const playersRepository = yield typeorm_1.getConnection().getRepository(player_1.default);
            const player = yield playersRepository.findOne({ id: req.params.id });
            if (!player)
                return res.status(404).send("Player with given id does not exist");
            yield typeorm_1.getConnection().manager.remove(player);
        });
    }
}
exports.default = PlayerService;
//# sourceMappingURL=playerService.js.map