import { number } from "joi";
import mongoose from "mongoose";

const CvstoJsoneData  = new mongoose.Schema({
    sensex: { type: Array, default: [] },
    finNifty:{ type: Array, default: [] },
    midcpNifty: { type: Array, default: [] },
    nifty: { type: Array, default: [] },
    bankNifty: { type: Array, default: [] }
})


export const csvTojson = mongoose.model<any>('StockJsonDataStore', CvstoJsoneData)