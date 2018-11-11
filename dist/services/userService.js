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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("./../models/user");
const typeorm_1 = require("typeorm");
const playerService_1 = __importDefault(require("./playerService"));
class UserService {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = user_1.User.validateUser(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
            const userRepository = yield typeorm_1.getConnection().getRepository(user_1.User);
            const existingUser = yield userRepository.findOne({
                login: req.body.login
            });
            if (existingUser)
                return res.status(400).send("User already exist");
            this.saveUser(req, res);
        });
    }
    saveUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = yield typeorm_1.getConnection().getRepository(user_1.User);
            const userFromRequestBody = req.body;
            let user = yield userRepository.create(userFromRequestBody);
            const salt = yield bcrypt_1.default.genSalt(7);
            user.password = yield bcrypt_1.default.hash(user.password, salt);
            yield typeorm_1.getConnection().manager.save(user);
            const playerService = new playerService_1.default();
            const player = yield playerService.createPlayerForUser(user);
            res.send(player);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = yield typeorm_1.getConnection().getRepository(user_1.User);
            const user = yield userRepository.findOne({ id: req.params.id });
            user.firstName = req.body.firstName;
            user.secondName = req.body.secondName;
            user.imgURL = req.body.imgURL;
            yield typeorm_1.getConnection().manager.save(user);
            res.send(user);
        });
    }
    deleteUser() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = UserService;
//# sourceMappingURL=userService.js.map