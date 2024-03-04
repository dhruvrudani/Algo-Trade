import { KiteConnect } from "kiteconnect";
import config from "config";
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

export const kitelogin = async () => {
    try {
        // const loginURL = kite.getLoginURL();
        // console.log("Login URL:", loginURL);

        // In a real application, you need to redirect the user to loginURL and handle the callback to obtain the requestToken.

        const requestToken = '3un54xHiyGptxPQlmTYdGeKjni0XaP4Z';

        // Generate session using requestToken
        const response = await kite.generateSession(requestToken, '66izcfeq5uqpm4n9gd9bumdgkqs0sxnq');
        console.log('response :>> ', response);

        // Check if session generation was successful
        if (response.status === 'success') {
            const accessToken = response.access_token;
            kite.setAccessToken(accessToken);

            // Fetch user profile using the generated session
            const userProfile = await new Promise((resolve, reject) => {
                kite.getProfile((error, data) => {
                    if (error) {
                        console.log("Error getting user profile:", error);
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            console.log(userProfile);
            return userProfile;
        } else {
            // Handle error response
            console.log("Session generation failed:", response);
            throw new Error("Session generation failed");
        }
    } catch (error) {
        console.log("Error in kitelogin:", error);
        throw error;
    }
};