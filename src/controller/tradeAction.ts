import { KiteConnect } from "kiteconnect";
import config from "config";
import { adminTrade, userModel, userTrade } from "../database";
import { apiResponse } from "../common";
import data from "../helpers/userdata.json";
import fund from "../helpers/funding.json";
import { responseMessage } from "../helpers/response";
import { stockQuantity } from "../helpers/testing";
import { encryptData } from "../common/encryptDecrypt";
import mongoose from "mongoose";
import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
const jsondata = data;
const funddata = fund;
const ObjectId = mongoose.Types.ObjectId
let usTime = new Date()
let options = { timeZone: 'Asia/kolkata', hour12: false }
let indiaTime = usTime.toLocaleString('en-US', options)

export const buystock = async (req: Request, res: Response) => {
    try {


        console.log('indiaTime', indiaTime)
        const fundObj = funddata["data"];
        const body = req.body
        const price = body.quantity * body.price;
        const totalprice = price.toFixed(11);
        const fund = Number(fundObj['equity'].net.toFixed(11));


        const adminTradeEnter: any = new adminTrade({
            tradingsymbol: body.tradingsymbol,
            exchange: body.exchange,
            transaction_type: body.transaction_type,
            order_type: body.order_type,
            // quantity: body.quantity,
            product: body.product,
            buyPrice: body.price,
            buyAT: indiaTime
        })


        const resultAdminTradeEnter = await adminTradeEnter.save();

        const alluserdata = await userModel.find();
        console.log('👻alluserdata', alluserdata)
        let userTradeEnter: any = [];
        for (let i = 0; i < alluserdata.length; i++) {
            const id = alluserdata[i]._id;
            //here get user live margin data 
            if (alluserdata[i].access_key && Number(totalprice) <= Number(fund)) {

                userTradeEnter.push({
                    trade_id: resultAdminTradeEnter._id,
                    user_id: id,
                    tradingsymbol: body.tradingsymbol,
                    buyOrderId: "123456",
                    quantity: body.quantity,
                    isSelled: false,
                    buyAT: indiaTime,
                    accessToken: alluserdata[i].access_key,
                    lessQuantity: false,
                    buytradeStatus: null,
                });
            } else if (Number(totalprice) > Number(fund)) {

                const quantity = stockQuantity(body.quantity, fund, Number(totalprice))

                if (quantity != 0) {
                    userTradeEnter.push({
                        trade_id: resultAdminTradeEnter._id,
                        user_id: id,
                        tradingsymbol: body.tradingsymbol,
                        buyOrderId: "123456",
                        quantity: quantity,
                        isSelled: false,
                        buyAT: indiaTime,
                        accessToken: alluserdata[i].access_key,
                        lessQuantity: true,
                        buytradeStatus: null,
                    });
                } else if (quantity === 0) {
                    userTradeEnter.push({
                        trade_id: resultAdminTradeEnter._id,
                        msg: "in insufficient balance",
                        accessToken: alluserdata[i].access_key
                    });
                }
            }
        }
         const insertdata = new userTrade({
            trade: userTradeEnter
            
        })
        var resultUserTradeEnter = await insertdata.save();

        // kite.placeOrder(orderParams, (err, response) => {
        //     if (err) {
        //         console.error("Error placing order:", err);
        //     } else {
        //         console.log("Order placed successfully:", response);
        //     }
        // });

        // console.log(orderParams);

        return res.status(200).json(new apiResponse(200, "buy stock details", { resultAdminTradeEnter, resultUserTradeEnter }, {}));

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}

// sell stock
export const sellstock = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const price = body.quantity * body.price;
        const quantity = 12;
        // const totalprice = price.toFixed(11);

        // const adminTradeEnter: any = new adminTrade({
        //     tradingsymbol: body.tradingsymbol,
        //     exchange: body.exchange,
        //     transaction_type: body.transaction_type,
        //     order_type: body.order_type,
        //     quantity: body.quantity,
        //     product: body.product,
        //     sellPrice: body.price,
        //     sellAT: indiaTime
        // })

        // const resultAdminTradeEnter = await adminTradeEnter.save();

        const alluserdata = await userModel.find();
        const tradeData = await userTrade.find();

        if (tradeData) {
            let counter = quantity;

            for (let i = 0; i < alluserdata.length; i++) {
                const id = alluserdata[i]._id;
                if (counter !== 0) {

                    for (let j = 0; j < tradeData.length; j++) {
                        let data = tradeData[j].trade;
                        for (let k = 0; k < data.length; k++) {
                            console.log(`trade user id ${data[k].user_id} and actual id ${id}`);
                            if (String(data[k].user_id) === String(id) && data[k].isSelled === false && data[k].quantity > 0 && counter !== 0) {
                                counter = counter - data[k].quantity;
                                const order_id = data[k].order_id;
                                console.log("hello");
                                const updatedata = await userTrade.findOneAndUpdate({ "trade.order_id": order_id }, { $set: { "trade.$.isSelled": true , "trade.$.sellAt" : indiaTime} })
                            }
                        }
                    }
                }
            }

            // const insertdata = new userTrade({
            //     trade: userTradeEnter
            // })
            // var resultUserTradeEnter = await insertdata.save();
        }

        // kite.placeOrder(orderParams, (err, response) => {
        //     if (err) {
        //         console.error("Error placing order:", err);
        //     } else {
        //         console.log("Order placed successfully:", response);
        //     }
        // });

        // console.log(orderParams);

        // return res.status(200).json(new apiResponse(200, "sell stock details", { resultAdminTradeEnter, resultUserTradeEnter }, {}));
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage.internalServerError, {}, error));
    }
}
