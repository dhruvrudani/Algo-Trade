import { number } from "joi";
import mongoose from "mongoose";

const userTradeSchema = new mongoose.Schema({
    trade_id: { type: String, default: null },
    tradingsymbol: { type: String, default: null },
    stockName: { type: String, default: null },
    loatSize: { type: Number, default: null },
    tradeTime: { type: String, default: null },
    trade: { type: Array, default: [] }
})

// stockSchema.pre('save', function (next) {
//     let now = new Date();
//     this.updatedAt = now;
//     if (!this.createdAt) {
//         this.createdAt = now;
//     }
//     next();
// });

export const userTrade = mongoose.model<any>('userTrade', userTradeSchema)