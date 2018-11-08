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
const playerTeamCarrer_1 = require("./playerTeamCarrer");
const team_1 = require("./../team/team");
const user_1 = require("./../user");
const typeorm_1 = require("typeorm");
const joi_1 = __importDefault(require("joi"));
let Player = class Player {
    constructor() {
        this.number = 0;
        this.position = "";
        this.strongerFoot = "";
        this.dateOfBirth = new Date(1990, 1, 1);
    }
    static validatePlayer(player) {
        const schema = {
            number: joi_1.default.number()
                .min(0)
                .max(99)
                .required(),
            position: joi_1.default.string().equal([
                "goalkeeper",
                "defender",
                "midfielder",
                "striker"
            ]),
            strongerFoot: joi_1.default.string().equal(["left", "right", "both"])
        };
        return joi_1.default.validate(player, schema);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment"),
    __metadata("design:type", Number)
], Player.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Player.prototype, "number", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Player.prototype, "position", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Player.prototype, "strongerFoot", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime" }),
    __metadata("design:type", Date)
], Player.prototype, "dateOfBirth", void 0);
__decorate([
    typeorm_1.OneToOne(type => user_1.User),
    typeorm_1.JoinColumn(),
    __metadata("design:type", user_1.User)
], Player.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToOne(type => team_1.Team, { nullable: true }),
    typeorm_1.JoinColumn({}),
    __metadata("design:type", team_1.Team)
], Player.prototype, "team", void 0);
__decorate([
    typeorm_1.OneToMany(type => playerTeamCarrer_1.PlayerTeamCarrer, carrer => carrer.player),
    __metadata("design:type", Array)
], Player.prototype, "playerTeamCarrers", void 0);
Player = __decorate([
    typeorm_1.Entity()
], Player);
exports.Player = Player;
exports.default = Player;
//# sourceMappingURL=player.js.map