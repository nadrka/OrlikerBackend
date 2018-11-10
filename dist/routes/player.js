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
const playerService_1 = __importDefault(require("../services/playerService"));
const router = express_1.default.Router();
const playerService = new playerService_1.default();
router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const player = yield playerService.createPlayer(req, res);
    res.send(player);
}));
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const players = yield playerService.getAllPlayers(req, res);
    res.send(players);
}));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const player = yield playerService.getPlayerWithGivenID(req, res, req.params.id);
    res.send(player);
}));
router.put("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield playerService.updatePlayer(req, res);
}));
router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    playerService.deletePlayerWithGivenID(req, res, req.params.id);
}));
exports.default = router;
//# sourceMappingURL=player.js.map