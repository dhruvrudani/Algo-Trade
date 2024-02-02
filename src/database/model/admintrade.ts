import mongoose from "mongoose";

const adminTradeSchema = new mongoose.Schema({
    tradingsymbol: { type: String, default: null },
    exchange: { type: String, default: null },
    transaction_type: { type: String, default: null },
    order_type: { type: String, default: null },
    quantity: { type: Number, default: null },
    product: { type: String, default: null },
    buyPrice: { type: Number, default: null },
    sellPrice: { type: Number, default: null },
    buyAT: { type: Date, default: null },
    sellAT: { type: Date, default: null }
})

export const adminTrade = mongoose.model<any>('adminTrade', adminTradeSchema)