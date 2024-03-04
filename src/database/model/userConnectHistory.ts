import mongoose from "mongoose";
let buyAT = new Date();
let options = { timeZone: 'Asia/Kolkata', hour12: false };
let indiaTime = buyAT.toLocaleString('en-US', options);
console.log('👻👻indianTime', indiaTime)

const connectHistoryData = new mongoose.Schema({
    date: { type: String, default: null },
    details: { type: Array, default: null }
})

export const connectHistory = mongoose.model<any>('connectHistory', connectHistoryData)