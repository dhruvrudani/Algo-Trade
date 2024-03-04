import { KiteConnect } from "kiteconnect";
import config from "config";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId
let usTime = new Date()
let options = { timeZone: 'Asia/kolkata', hour12: false }
let indiaTime = usTime.toLocaleString('en-US', options)
const kite = new KiteConnect({
    api_key: config.get('api_key'),
});


//funds and margins

export const getFundsAndMargins = async (accessToken, segment) => {

    kite.setAccessToken(accessToken);

    return await kite.getMargins()

};
// Modified retrieveOrders function
export const retrieveOrders = async (accessToken) => {

    kite.setAccessToken(accessToken);

    return await kite.getOrders()

}
