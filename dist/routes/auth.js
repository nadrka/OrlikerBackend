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
const joi_1 = __importDefault(require("joi"));
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const users = yield typeorm_1.getConnection().manager.find(user_1.User);
    res.send(users);
}));
router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { error } = validate(req.body);
    if (error)
        res.status(400).send(error.details[0].message);
    const userRepository = yield typeorm_1.getConnection().getRepository(user_1.User);
    const existingUser = yield userRepository.findOne({
        login: req.body.login
    });
    if (!existingUser)
        return res.status(400).send("Invalid email or password");
    const validPassword = yield bcrypt_1.default.compare(req.body.password, existingUser.password);
    if (!validPassword)
        return res.status(400).send("Invalid email or password");
    const token = existingUser.generateAuthToken();
    res.send(token);
}));
function validate(req) {
    const schema = {
        login: joi_1.default.string()
            .min(5)
            .max(50)
            .required(),
        password: joi_1.default.string()
            .min(5)
            .max(50)
            .required()
    };
    return joi_1.default.validate(req, schema);
}
exports.default = router;
//# sourceMappingURL=auth.js.map