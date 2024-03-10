import mongoose from "mongoose";
let buyAT = new Date();
let options = { timeZone: 'Asia/Kolkata', hour12: false };
let indiaTime = buyAT.toLocaleString('en-US', options);
console.log('👻👻indianTime', indiaTime)

const lastConnectHistoryData = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    loginAt: { type: String, default: null },
    logoutAt: { type: String, default: null }
})

export const LastConnectHistory = mongoose.model<any>('lastConnectHistory', lastConnectHistoryData)