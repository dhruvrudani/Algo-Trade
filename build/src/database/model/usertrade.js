"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTrade = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userTradeSchema = new mongoose_1.default.Schema({
    trade: { type: Array, default: [] }
});
// stockSchema.pre('save', function (next) {
//     let now = new Date();
//     this.updatedAt = now;
//     if (!this.createdAt) {
//         this.createdAt = now;
//     }
//     next();
// });
exports.userTrade = mongoose_1.default.model('userTrade', userTradeSchema);
//# sourceMappingURL=usertrade.js.map