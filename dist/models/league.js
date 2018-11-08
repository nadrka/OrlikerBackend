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
const typeorm_1 = require("typeorm");
const joi_1 = __importDefault(require("joi"));
const season_1 = __importDefault(require("./season"));
const teamParticipation_1 = __importDefault(require("./team/teamParticipation"));
let League = class League {
    static validateGenre(league) {
        const schema = {
            leagueNumber: joi_1.default.number()
                .min(1)
                .max(4)
                .required(),
            group: joi_1.default.string().equal(["A", "B", "C", "D"])
        };
        return joi_1.default.validate(league, schema);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment"),
    __metadata("design:type", Number)
], League.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], League.prototype, "leagueNumber", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], League.prototype, "group", void 0);
__decorate([
    typeorm_1.OneToMany(type => teamParticipation_1.default, teamParcitipation => teamParcitipation.league),
    __metadata("design:type", Array)
], League.prototype, "teamParcitipations", void 0);
__decorate([
    typeorm_1.ManyToOne(type => season_1.default, season => season.leagues),
    __metadata("design:type", season_1.default)
], League.prototype, "season", void 0);
League = __decorate([
    typeorm_1.Entity()
], League);
exports.League = League;
exports.default = League;
//# sourceMappingURL=league.js.map