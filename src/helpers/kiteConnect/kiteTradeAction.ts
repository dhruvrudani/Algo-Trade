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

//buy trade

export const buy = async (data) => {

    const { access_key, tradingsymbol, quantity, exchange, order_type, product, price } = data;
    kite.setAccessToken(access_key);


    // const response = await kite.ltp([tradingsymbol]);
    // const instrumentToken = response[tradingsymbol].instrument_token;

    // Place a market order to buy
    if (order_type === "MARKET") {

        return await kite.placeOrder("regular", {
            tradingsymbol: tradingsymbol,
            exchange: exchange,
            transaction_type: "BUY",
            order_type: order_type,
            quantity,
            product: product,
        });
    } else {
        return await kite.placeOrder("regular", {
            tradingsymbol: tradingsymbol,
            exchange: exchange,
            transaction_type: "BUY",
            order_type: order_type,
            quantity,
            product: product,
            price: price
        });
    }
}

export const sell = async (data) => {
    const { access_key, id, tradingsymbol, quantity, exchange, order_type, product, price } = data;
    kite.setAccessToken(access_key);
    try {
        // const response = await kite.ltp([tradingsymbol]);
        // const instrumentToken = response[tradingsymbol].instrument_token;
        // Place a market order to buy

        if (order_type === "MARKET") {

            return await kite.placeOrder("regular", {
                tradingsymbol: tradingsymbol,
                exchange: exchange,
                transaction_type: "SELL",
                order_type: order_type,
                quantity,
                product: product,
            });
        } else {
            return await kite.placeOrder("regular", {
                tradingsymbol: tradingsymbol,
                exchange: exchange,
                transaction_type: "SELL",
                order_type: order_type,
                quantity,
                product: product,
                price: price
            });
        }
    } catch (error) {
        console.error(`Error placing order for user ${id}:`, error);
    }
}

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

export const getOrderTrades = async (accessToken, order_id) => {

    kite.setAccessToken(accessToken);

    kite.getOrderTrades(order_id)
        .then(function (response) {
            return response;
        }).catch(function (err) {
            return err;
        });
}