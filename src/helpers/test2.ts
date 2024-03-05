import { KiteConnect } from "kiteconnect";
import config from "config";
import mongoose from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
import { ObjectId } from 'mongoose';
import { userModel } from "../database";
const { Types } = require('mongoose');

let usTime = new Date()
let options = { timeZone: 'Asia/kolkata', hour12: false }
let indiaTime = usTime.toLocaleString('en-US', options)

// Create a new instance of KiteConnect
const kite = new KiteConnect({
    api_key: "9wgina6u558jh083",
    // api_key: config.get('api_key'),
});

// Function to login and obtain access token
export const kitelogin = async () => {
    try {
        //   let accessToken ="7Fcmz5S9YRBXCnXUlrFnc6MGBb2W4KqU";
        let getrequestToken = await userModel.findOne({_id:"65ddccc397f2e72f4da34460"});
        // console.log('getrequestToken :>> ', getrequestToken);
        const requestToken = getrequestToken.request_token;
        const response = await kite.generateSession(requestToken, '66izcfeq5uqpm4n9gd9bumdgkqs0sxnq');
        // console.log('response :>> ', response);

        if (response.broker === 'ZERODHA') {
            const accessToken = response.access_token;
            kite.setAccessToken(accessToken);
            return accessToken; // Return the access token
        } else {
            console.log("Session generation failed:", response);
            throw new Error("Session generation failed");
        }
    } catch (error) {
        console.log("Error in kitelogin:", error);
        throw error;
    }
};

// Function to fetch order history using the obtained access token
export const testkite = async (req: Request, res: Response) => {
//     const instrumentToken = '256265'; // Example instrument token
// const interval = 'minute'; // Example interval
// const fromDate = new Date('2022-01-01T09:15:00Z'); // Example from date
// const toDate = new Date('2022-01-01T15:30:00Z'); // Example to date
// const continuous = false;
    try {
        console.log('👻run code :>> ');
        // const accessToken = await kitelogin(); // Obtain the access token
        // console.log('accessToken :>> ', accessToken);
        kite.setAccessToken("GNzXFkevr5Y8ck3QNjV0fr6CPXs4gGUa"); // Set the access token

        
	// getHistoricalData(779521, "day", new Date("2018-01-01 18:05:00"), new Date("2018-01-10 18:05:37"));
const orderHistory = await getOrderHistory(); // Fetch order history
        console.log('kiteData :>> ',orderHistory  );
        res.send(orderHistory); // Send the response back to the client
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Internal Server Error'); // Send an error response
    }
};

// Function to fetch order history
function getOrderHistory(): Promise<any> {
    console.log('getOrderhistory run.. :>> ');
    return new Promise((resolve, reject) => {
        kite.getOrders()
            .then((response) => {
                console.log('response :>> ', response);
                if (response.length === 0) {
                    console.log("No orders.");
                    resolve([]);
                    return;
                }
                kite.getOrderHistory(response[0].order_id)
                    .then((response) => {
                        // console.log(response);
                        resolve(response);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}



export function getHistoricalData(instrument_token, interval,from_date, to_date) {
    
    console.log('gethistoricaldatafuction run.. :>> ');
	kite.getHistoricalData(instrument_token,interval,  from_date, to_date, false)
		.then(function(response) {
			console.log(response);
		}).catch(function(err) {
			console.log(err);
		});
}