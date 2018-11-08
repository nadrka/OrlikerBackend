"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./../user");
const typeorm_1 = require("typeorm");
const joi_1 = __importDefault(require("joi"));
const matchResult_1 = __importDefault(require("./matchResult"));
const team_1 = __importDefault(require("../team/team"));
let Match = class Match {
    static validateGenre(match) {
        const schema = {
            name: joi_1.default.string()
                .min(3)
                .max(50)
                .required()
        };
        return joi_1.default.validate(match, schema);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment"),
    __metadata("design:type", Number)
], Match.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Match.prototype, "status", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Match.prototype, "place", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Match.prototype, "matchDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Match.prototype, "acceptMatchDate", void 0);
__decorate([
    typeorm_1.OneToOne(type => matchResult_1.default, { nullable: true }),
    typeorm_1.JoinColumn({}),
    __metadata("design:type", matchResult_1.default)
], Match.prototype, "result", void 0);
__decorate([
    typeorm_1.OneToOne(type => user_1.User),
    typeorm_1.JoinColumn({}),
    __metadata("design:type", user_1.User)
], Match.prototype, "referee", void 0);
__decorate([
    typeorm_1.OneToOne(type => team_1.default),
    typeorm_1.JoinColumn({}),
    __metadata("design:type", team_1.default)
], Match.prototype, "homeTeam", void 0);
__decorate([
    typeorm_1.OneToOne(type => team_1.default),
    typeorm_1.JoinColumn({}),
    __metadata("design:type", matchResult_1.default)
], Match.prototype, "awayTeam", void 0);
Match = __decorate([
    typeorm_1.Entity()
], Match);
exports.Match = Match;
exports.default = Match;
//# sourceMappingURL=match.js.map