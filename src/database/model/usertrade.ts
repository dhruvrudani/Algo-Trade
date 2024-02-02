import mongoose from "mongoose";

const userTradeSchema = new mongoose.Schema({
    trade : {type:Array , default:[]}
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