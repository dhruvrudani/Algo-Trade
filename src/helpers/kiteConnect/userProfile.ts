import { KiteConnect } from "kiteconnect";
import config from "config";
import mongoose from "mongoose";
import { Request, Response } from 'express'
import { ObjectId } from 'mongoose';
import util from 'util';
import { userModel } from "../../database";

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

export const kitelogin = async (id) => {
    try {
        // Uncomment the following lines in a real application
        // const loginURL = kite.getLoginURL();
        // console.log("Login URL:", loginURL);
        // In a real application, you need to redirect the user to loginURL and handle the callback to obtain the requestToken.

        const requestToken = await userModel.findById(id, { _id: 0, request_token: 1 });

        console.log("😄😄😄😄😄😄",requestToken);
        // Generate session using requestToken
        const response = await kite.generateSession(requestToken.request_token, config.get('api_secret'));

        console.log('response :>> ', response);

        // Check if session generation was successful
        const accessToken = response.access_token;
        kite.setAccessToken(accessToken);

        // Fetch user profile using the generated session
        const data = await kite.getProfile();
        console.log('user data ', data);

        return { data, accessToken };
    } catch (error) {
        console.log("Error in kitelogin:", error.message);
        throw error;
    }
};
