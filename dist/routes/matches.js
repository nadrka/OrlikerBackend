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
const matchService_1 = __importDefault(require("../services/matchService"));
const router = express_1.default.Router();
const matchService = new matchService_1.default();
router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield matchService.createMatch(req, res);
}));
router.post("/:id/result", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield matchService.createMatchResult(req, res);
}));
router.get("/:id/statistics", (req, res) => __awaiter(this, void 0, void 0, function* () { }));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield matchService.getMatchForGivenID(req.params.id, res);
}));
router.put("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield matchService.updateMatchWithRequestBody(req, res);
}));
router.put("/:id/result", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield matchService.updateMatchResult(req, res);
}));
router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield matchService.deleteMatch(req, res);
}));
exports.default = router;
//# sourceMappingURL=matches.js.map