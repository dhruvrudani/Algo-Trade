import { KiteConnect } from "kiteconnect";
import config from "config";
// import { adminTrade, userModel, userTrade, tradeQuantity } from "../../database";
// import { apiResponse } from "../../common";
// import data from "../../helpers/userdata.json";
// import fund from "../../helpers/funding.json";
// import { responseMessage } from "../../helpers/response";
// import { stockQuantity } from "../../helpers/testing";
// import { encryptData } from "../../common/encryptDecrypt";
import mongoose from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
import { ObjectId } from 'mongoose';
// const jsondata = data;
// const funddata = fund;
const { Types } = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
let usTime = new Date()
let options = { timeZone: 'Asia/kolkata', hour12: false }
let indiaTime = usTime.toLocaleString('en-US', options)
const kite = new KiteConnect({
    api_key: config.get('api_key'),
});
//kite login API

export const kitelogin = async (requestToken) => {

    const loginURL = kite.getLoginURL();

    console.log("Login URL:", loginURL);
    var accesstoken;
    kite.generateSession(requestToken, config.get('api_secret'))
        .then(response => {
            accesstoken = response.access_token;
        })
        .catch(error => {
            console.log("Error when generating the access token", error)
        })

    kite.setAccessToken(accesstoken);

    kite.getProfile((error, data) => {
        if (error) {
            console.log("getting error while get profile of the user", error);
        } else if (data) {
            return data;
        }
    })
}

//incomplete
export const buy = async () => {

    const placeBuyOrder = async (apiKey, apiSecret, accessToken, userId, symbol, quantity) => {
        const kite = new KiteConnect({
            api_key: apiKey,
        });
    
        kite.setAccessToken(accessToken);
    
        try {
            const response = await kite.ltp([symbol]);
            const instrumentToken = response[symbol].instrument_token;
    
            // Place a market order to buy
            const orderResponse = await kite.placeOrder(userId, "regular", {
                tradingsymbol: symbol,
                exchange: "NSE", // or "BSE" for BSE stocks
                transaction_type: "BUY",
                order_type: "MARKET",
                quantity,
                product: "CNC", // Cash and carry for delivery trades
            });
    
            console.log(`Order placed successfully for user ${userId}:`, orderResponse);
        } catch (error) {
            console.error(`Error placing order for user ${userId}:`, error);
        }
    };
    
    const users = [
        {
            apiKey: "user1_api_key",
            apiSecret: "user1_api_secret",
            accessToken: "user1_access_token",
            userId: "user1_user_id",
        },
        // Add more user data as needed
    ];
    
    // Define the symbol and quantity for the buy trade
    const symbol = "SBIN"; // Example: State Bank of India
    const quantity = 1;
    
    // Place buy orders for multiple users concurrently
    const orderPromises = users.map(user =>
        placeBuyOrder(user.apiKey, user.apiSecret, user.accessToken, user.userId, symbol, quantity)
    );
    
    // Wait for all orders to be placed before proceeding
    Promise.all(orderPromises)
        .then(() => {
            console.log("All orders placed successfully.");
        })
        .catch((error) => {
            console.error("Error placing orders:", error);
        });
    

}