"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTrade = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let buyAT = new Date();
let options = { timeZone: 'Asia/Kolkata', hour12: false };
let indiaTime = buyAT.toLocaleString('en-US', options);
console.log('👻👻indianTime', indiaTime);
const adminTradeSchema = new mongoose_1.default.Schema({
    tradingsymbol: { type: String, default: null },
    exchange: { type: String, default: null },
    transaction_type: { type: String, default: null },
    order_type: { type: String, default: null },
    quantity: { type: Number, default: null },
    product: { type: String, default: null },
    buyPrice: { type: Number, default: null },
    sellPrice: { type: Number, default: null },
    buyOrderId: { type: Number, default: null },
    buyAT: { type: String, default: null },
    sellOrderId: { type: String, default: null },
    sellAT: { type: String, default: null }
});
exports.adminTrade = mongoose_1.default.model('adminTrade', adminTradeSchema);
//# sourceMappingURL=admintrade.js.map