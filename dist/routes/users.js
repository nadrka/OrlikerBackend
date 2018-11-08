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
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const userService_1 = __importDefault(require("../services/userService"));
const router = express_1.default.Router();
const userService = new userService_1.default();
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const users = yield typeorm_1.getConnection().manager.find(user_1.User);
    res.send(users);
}));
router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield userService.createUser(req, res);
}));
router.put("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield userService.updateUser(req, res);
}));
exports.default = router;
//# sourceMappingURL=users.js.map