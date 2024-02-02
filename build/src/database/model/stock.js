"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const stockSchema = new mongoose_1.default.Schema({
    user_id: { type: String, default: null },
    tradingsymbol: { type: String, default: null },
    exchange: { type: String, default: null },
    transaction_type: { type: String, default: null },
    quantity: { type: String, default: null },
    order_type: { type: String, default: null },
    buyPrice: { type: String, default: null },
    product: { type: String, default: null },
    sellPrice: { type: String, default: null },
    buyAT: { type: Date, default: null },
    sellAT: { type: Date, default: null }
});
// stockSchema.pre('save', function (next) {
//     let now = new Date();
//     this.updatedAt = now;
//     if (!this.createdAt) {
//         this.createdAt = now;
//     }
//     next();
// });
exports.stockModel = mongoose_1.default.model('stockData', stockSchema);
//# sourceMappingURL=stock.js.map