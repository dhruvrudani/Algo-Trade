import mongoose from "mongoose";

let buyAT = new Date();
let options = { timeZone: 'Asia/Kolkata', hour12: false };
let indiaTime = buyAT.toLocaleString('en-US', options);

const tradeQuantitySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    quantity: { type: Number, default: null },
    setAt: { type: String, default: null }
});

export const tradeQuantity = mongoose.model<any>('TradeQuantity', tradeQuantitySchema);
