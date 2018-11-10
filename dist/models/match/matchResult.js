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
let MatchResult = class MatchResult {
    static validateMatchResult(matchResult) {
        const schema = {
            homeTeamResult: joi_1.default.number()
                .min(0)
                .max(50)
                .required(),
            awayTeamResult: joi_1.default.number()
                .min(0)
                .max(50)
                .required(),
            writtenById: joi_1.default.number()
                .min(1)
                .optional()
        };
        return joi_1.default.validate(matchResult, schema);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment"),
    __metadata("design:type", Number)
], MatchResult.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchResult.prototype, "homeTeamResult", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MatchResult.prototype, "awayTeamResult", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], MatchResult.prototype, "writtenById", void 0);
__decorate([
    typeorm_1.OneToOne(type => user_1.User, { nullable: true }),
    typeorm_1.JoinColumn({ name: "writtenById" }),
    __metadata("design:type", user_1.User)
], MatchResult.prototype, "writtenBy", void 0);
MatchResult = __decorate([
    typeorm_1.Entity()
], MatchResult);
exports.MatchResult = MatchResult;
exports.default = MatchResult;
//# sourceMappingURL=matchResult.js.map