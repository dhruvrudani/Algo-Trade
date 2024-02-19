import mongoose from "mongoose";

let buyAT = new Date();
let options = { timeZone: 'Asia/Kolkata', hour12: false };
let indiaTime = buyAT.toLocaleString('en-US', options);
console.log('👻👻indianTime', indiaTime)

const userSchema = new mongoose.Schema({
    fullname: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    email: { type: String, default: null },
    otp: { type: String, default: null },
    role:{ type: Number, default :null },
    location:{ type: String, default :null },
    access_key: { type: String, default: null },
    request_token: { type: String, default: null },
    z_user_id: { type: String, default: null },
    z_user_type: { type: String, default: null },
    z_email: { type: String, default: null },
    z_user_name: { type: String, default: null },
    z_user_shortname: { type: String, default: null },
    z_broker: { type: String, default: null },
    z_exchanges: { type: Array, default: null },
    z_products: { type: Array, default: null },
    z_order_types: { type: Array, default: null },
    z_avatar_url: { type: String, default: null },
    z_meta: { type: Object, default: null },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isKiteLogin: { type: Boolean, default: false },
    createdAt: { type: String, default: indiaTime },
    updatedAt: { type: String, default: indiaTime },
    otpExpire: { type: String, default: indiaTime }
})


export const userModel = mongoose.model<any>('user', userSchema)
