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
const genre_1 = require("./../models/genre");
const auth_1 = __importDefault(require("./../middlewares/auth"));
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { error } = genre_1.Genre.validateGenre(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const genreRepository = yield typeorm_1.getConnection().getRepository(genre_1.Genre);
    const genre = yield genreRepository.create(req.body);
    yield typeorm_1.getConnection().manager.save(genre);
    res.send(genre);
}));
router.get("/", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const genres = yield typeorm_1.getConnection().manager.find(genre_1.Genre);
    res.send(genres);
}));
router.put("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const genreRepository = yield typeorm_1.getConnection().getRepository(genre_1.Genre);
    const genre = yield genreRepository.findOne({ id: req.params.id });
    genre.name = req.body.name;
    yield typeorm_1.getConnection().manager.save(genre);
    res.send(genre);
}));
router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const genreRepository = typeorm_1.getConnection().getRepository(genre_1.Genre);
    const genre = yield genreRepository.findOne({ id: req.params.id });
    yield genreRepository.remove(genre);
    const genres = yield typeorm_1.getConnection().manager.find(genre_1.Genre);
    res.send(genres);
}));
exports.default = router;
//# sourceMappingURL=genres.js.map