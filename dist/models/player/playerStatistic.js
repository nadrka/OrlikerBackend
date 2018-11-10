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
const joi_1 = __importDefault(require("joi"));
const match_1 = require("./../match/match");
const typeorm_1 = require("typeorm");
const player_1 = __importDefault(require("./player"));
const team_1 = __importDefault(require("../team/team"));
let PlayerStatistic = class PlayerStatistic {
    static validatePlayerStatistic(statistic) {
        const schema = {
            goals: joi_1.default.number()
                .min(0)
                .optional(),
            assists: joi_1.default.number()
                .min(0)
                .optional(),
            yellowCards: joi_1.default.number()
                .min(0)
                .optional(),
            redCards: joi_1.default.number()
                .min(0)
                .optional(),
            playerId: joi_1.default.number()
                .min(1)
                .required(),
            teamId: joi_1.default.number()
                .min(1)
                .required(),
            matchId: joi_1.default.number()
                .min(1)
                .required()
        };
        return joi_1.default.validate(statistic, schema);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment"),
    __metadata("design:type", Number)
], PlayerStatistic.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStatistic.prototype, "goals", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStatistic.prototype, "assists", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStatistic.prototype, "yellowCards", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], PlayerStatistic.prototype, "redCards", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PlayerStatistic.prototype, "playerId", void 0);
__decorate([
    typeorm_1.OneToOne(type => player_1.default),
    typeorm_1.JoinColumn({ name: "playerId" }),
    __metadata("design:type", player_1.default)
], PlayerStatistic.prototype, "player", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PlayerStatistic.prototype, "teamId", void 0);
__decorate([
    typeorm_1.OneToOne(type => team_1.default),
    typeorm_1.JoinColumn({ name: "teamId" }),
    __metadata("design:type", team_1.default)
], PlayerStatistic.prototype, "team", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PlayerStatistic.prototype, "matchId", void 0);
__decorate([
    typeorm_1.OneToOne(type => match_1.Match),
    typeorm_1.JoinColumn({ name: "matchId" }),
    __metadata("design:type", match_1.Match)
], PlayerStatistic.prototype, "match", void 0);
PlayerStatistic = __decorate([
    typeorm_1.Entity()
], PlayerStatistic);
exports.PlayerStatistic = PlayerStatistic;
exports.default = PlayerStatistic;
//# sourceMappingURL=playerStatistic.js.map