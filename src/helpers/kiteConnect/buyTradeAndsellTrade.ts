import {
  adminTrade,
  userModel,
  userTrade,
  tradeQuantity,
} from "../../database";
import fund from "../../helpers/funding.json";
import { buy, getOrderTrades, sell, stockQuantity } from "../../helpers/index";
import { getFundsAndMargins } from "../../helpers/kiteConnect/index";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { kitelogin } from "../test2";

const funddata = fund;
const ObjectId = mongoose.Types.ObjectId;
let usTime = new Date();
let options = { timeZone: "Asia/kolkata", hour12: false };
let indiaTime = usTime.toLocaleString("en-US", options);
function generateRandomNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

export const buyTradeFunction = async (
    req: Request,
    res: Response,
    userData: any, 
    body: any, 
    resultAdminTradeEnter: any, 
    quantityObj: any 
  ) => {
    try {
      let returnObj;
      const fundObj = await getFundsAndMargins(
        userData.access_key,
        "equity"
      ).catch((error) => {
        console.error("Error in getFundsAndMargins:", error);
        throw error;
      });
      console.log(fundObj);
      const { _id: id, access_key, isKiteLogin } = userData;
      if (quantityObj) {
        const { quantity } = quantityObj;
  
        if (access_key && isKiteLogin === true) {
          console.log("😊😊😊😊😊😊");
          if (body.order_type === "MARKET") {
            const ex = 1; // Example: change this to retrieve live price function
            const price = (quantity * ex).toFixed(11);
            const fund = Number(fundObj["equity"].net.toFixed(11));
            let buyResponse;
  
            if (Number(price) <= fund) {
              const data: any = {
                access_key: userData.access_key,
                id: id,
                tradingsymbol: body.tradingsymbol,
                quantity: quantity,
                exchange: body.exchange,
                order_type: body.order_type,
                product: body.product,
              };
              buyResponse = await buy(data);
              console.log(buyResponse);
              const alluserdata = await userModel.findOneAndUpdate(
                {
                  _id: userData._id,
                  isActive: true,
                  isDelete: false,
                  isVerified: true,
                },
                {
                  $inc: {
                    totalUsePlan: +1,
                  },
                },
                { new: true }
              );
  
              const tradeData = getOrderTrades(
                userData.access_key,
                buyResponse.order_id
              );
              console.log("buy trade function tradeData :>> ", tradeData);
              await adminTrade.findByIdAndUpdate(
                { _id: resultAdminTradeEnter._id },
                { price: tradeData["average_price"] }
              );
              returnObj = {
                user_id: userData._id,
                tradingsymbol: body.tradingsymbol,
                buyOrderId: buyResponse.order_id,
                quantity,
                isSelled: false,
                buyKitePrice: tradeData["average_price"],
                buyAT: indiaTime,
                accessToken: access_key,
                lessQuantity: false,
                buytradeStatus: null,
              };
            } else {
              const updatedQuantity = stockQuantity(quantity, fund, Number(ex));
  
              if (updatedQuantity > 0) {
                const data: any = {
                  access_key: userData.access_key,
                  id: id,
                  tradingsymbol: body.tradingsymbol,
                  quantity: updatedQuantity,
                  exchange: body.exchange,
                  order_type: body.order_type,
                  product: body.product,
                };
  
                const buyData = await buy(data);
                const alluserdata = await userModel.findOneAndUpdate(
                  {
                    _id: userData._id,
                    isActive: true,
                    isDelete: false,
                    isVerified: true,
                  },
                  {
                    $inc: {
                      totalUsePlan: +1,
                    },
                  },
                  { new: true }
                );
                console.log(alluserdata);
                returnObj = {
                  user_id: userData._id,
                  tradingsymbol: body.tradingsymbol,
                  buyOrderId: buyData.order_id,
                  quantity: updatedQuantity,
                  isSelled: false,
                  buyKitePrice: body.price,
                  buyAT: indiaTime,
                  accessToken: access_key,
                  lessQuantity: true,
                  buytradeStatus: null,
                };
              } else {
                const price = (quantity * body.price).toFixed(11);
                const fund = Number(fundObj['equity'].net.toFixed(11));
                if (access_key && isKiteLogin) {
  
                  if (Number(price) <= fund) {
                    const data: any = {
                      access_key: userData.access_key,
                      id: id,
                      tradingsymbol: body.tradingsymbol,
                      quantity: quantity,
                      exchange: body.exchange,
                      order_type: body.order_type,
                      product: body.product,
                      price: body.price
                    };
  
                    const buyData = await buy(data);
  
                    const alluserdata = await userModel.findOneAndUpdate(
                      {
                        _id: userData._id,
                        isActive: true,
                        isDelete: false,
                        isVerified: true
                      },
                      {
                        $inc: {
                          totalUsePlan: +1
                        }
                      },
                      { new: true }
                    );
                    returnObj = {
                      user_id: userData._id,
                      tradingsymbol: body.tradingsymbol,
                      buyOrderId: buyData.order_id,
                      quantity,
                      isSelled: false,
                      buyKitePrice: body.price,
                      buyAT: indiaTime,
                      accessToken: access_key,
                      lessQuantity: false,
                      buytradeStatus: null,
                    };
                  } else {
                    const updatedQuantity = stockQuantity(quantity, fund, Number(price));
  
                    if (updatedQuantity > 0) {
                      const data: any = {
                        access_key: userData.access_key,
                        id: id,
                        tradingsymbol: body.tradingsymbol,
                        quantity: quantity,
                        exchange: body.exchange,
                        order_type: body.order_type,
                        product: body.product
                      };
  
                      const buyData = await buy(data);
                      const alluserdata = await userModel.findOneAndUpdate(
                        {
                          _id: userData._id,
                          isActive: true,
                          isDelete: false,
                          isVerified: true
                        },
                        {
                          $inc: {
                            totalUsePlan: +1
                          }
                        },
                        { new: true }
                      );
                      console.log(alluserdata);
                      returnObj = {
                        user_id: userData._id,
                        tradingsymbol: body.tradingsymbol,
                        buyOrderId: buyData.order_id,
                        quantity: updatedQuantity,
                        isSelled: false,
                        buyKitePrice: body.price,
                        buyAT: indiaTime,
                        accessToken: access_key,
                        lessQuantity: true,
                        buytradeStatus: null
                      };
                    } else {
                      returnObj = {
                        user_id: id,
                        trade_id: resultAdminTradeEnter._id,
                        msg: "Insufficient balance",
                        accessToken: access_key
                      };
                    }
                  }
                } else if (access_key === null) {
                  returnObj = {
                    user_id: id,
                    trade_id: resultAdminTradeEnter._id,
                    msg: "user not login",
                  };
                }
              }
            }
          } else {
            returnObj = {
              user_id: id,
              trade_id: resultAdminTradeEnter._id,
              msg: "Insufficient balance",
              accessToken: access_key,
            };
          }
        } else {
          const price = (quantity * body.price).toFixed(11);
          const fund = Number(fundObj["equity"].net.toFixed(11));
          if (Number(price) <= fund) {
            const data: any = {
              access_key: userData.access_key,
              id: id,
              tradingsymbol: body.tradingsymbol,
              quantity: quantity,
              exchange: body.exchange,
              order_type: body.order_type,
              product: body.product,
              price: body.price,
            };
  
            const buyData = await buy(data);
            console.log("Limit if buyData :>> ", buyData);
            const alluserdata = await userModel.findOneAndUpdate(
              {
                _id: userData._id,
                isActive: true,
                isDelete: false,
                isVerified: true,
              },
              {
                $inc: {
                  totalUsePlan: +1,
                },
              },
              { new: true }
            );
            returnObj = {
              user_id: userData._id,
              tradingsymbol: body.tradingsymbol,
              buyOrderId: buyData.order_id,
              quantity,
              isSelled: false,
              buyKitePrice: body.price,
              buyAT: indiaTime,
              accessToken: access_key,
              lessQuantity: false,
              buytradeStatus: null,
            };
          } else {
            const updatedQuantity = stockQuantity(
              quantity,
              fund,
              Number(price)
            );
  
            if (updatedQuantity > 0) {
              const data: any = {
                access_key: userData.access_key,
                id: id,
                tradingsymbol: body.tradingsymbol,
                quantity: updatedQuantity,
                exchange: body.exchange,
                order_type: body.order_type,
                product: body.product,
              };
  
              const buyData = await buy(data);
              const alluserdata = await userModel.findOneAndUpdate(
                {
                  _id: userData._id,
                  isActive: true,
                  isDelete: false,
                  isVerified: true,
                },
                {
                  $inc: {
                    totalUsePlan: +1,
                  },
                },
                { new: true }
              );
              console.log(alluserdata);
              returnObj = {
                user_id: userData._id,
                tradingsymbol: body.tradingsymbol,
                buyOrderId: buyData.order_id,
                quantity: updatedQuantity,
                isSelled: false,
                buyKitePrice: body.price,
                buyAT: indiaTime,
                accessToken: access_key,
                lessQuantity: true,
                buytradeStatus: null,
              };
            } else {
              returnObj = {
                user_id: id,
                trade_id: resultAdminTradeEnter._id,
                msg: "Insufficient balance",
                accessToken: access_key,
              };
            }
          }
        }
      } else if (access_key === null && isKiteLogin === false) {
        returnObj = {
          user_id: id,
          trade_id: resultAdminTradeEnter._id,
          msg: "user not login",
        };
      } else {
        returnObj = {
          user_id: id,
          trade_id: resultAdminTradeEnter._id,
          msg: "user does not set quantity of trade",
          accessToken: access_key,
        };
      }
      return returnObj;
    } catch (error) {
      return error;
    }
  };

export const sellTradeFunction = async (
  req: Request,
  res: Response,
  userdata,
  body
) => {
  try {
    let obj;
    const buyTradeData = await userTrade.findOne({ trade_id: body.id });
    if (buyTradeData && buyTradeData.trade_id === body.id) {
      const id = userdata._id;
      let quantity =
        (await tradeQuantity.findOne({ user_id: id }))?.quantity || 0;

      if (body.order_type === "MARKET") {
        if (quantity > 0 && userdata.isKiteLogin === true) {
          for (const sellData of buyTradeData.trade) {
            if (
              String(sellData.user_id) === String(id) &&
              !sellData.isSelled &&
              sellData.quantity > 0 &&
              quantity !== 0 &&
              sellData.tradingsymbol === body.tradingsymbol
            ) {
              quantity -= sellData.quantity;
              const order_id = sellData.buyOrderId;
              const random5DigitNumber = generateRandomNumber();
              const sellrequireddata: any = {
                access_key: sellData.access_key,
                id: id,
                tradingsymbol: body.tradingsymbol,
                quantity: quantity,
                exchange: body.exchange,
                order_type: body.order_type,
                product: body.product,
              };

              await sell(sellrequireddata);

              const profit =
                Number(sellData.quantity) *
                  Number(body.sellPrice) *
                  Number(buyTradeData.loatSize) -
                Number(sellData.quantity) *
                  Number(sellData.buyKitePrice) *
                  Number(buyTradeData.loatSize);
              console.log(
                sellData.quantity *
                  Number(sellData.buyKitePrice) *
                  Number(buyTradeData.loatSize)
              );
              await userTrade.updateOne(
                { "trade.user_id": id, "trade.buyOrderId": order_id },
                {
                  $set: {
                    "trade.$.isSelled": true,
                    "trade.$.sellAt": indiaTime,
                    "trade.$.sellOrderId": random5DigitNumber,
                    "trade.$.sellKitePrice": body.sellPrice,
                    "trade.$.profit": profit,
                    "trade.$.selltradeStatus": null,
                  },
                }
              );

              const data = await userTrade.findOne({
                "trade.user_id": id,
                "trade.buyOrderId": order_id,
              });
              for (const tradeData of data.trade) {
                if (String(tradeData.user_id) === String(id)) {
                  return (obj = tradeData);
                }
              }
            }
          }
        }
      }

      if (quantity > 0 && userdata.isKiteLogin === true) {
        for (const sellData of buyTradeData.trade) {
          if (
            String(sellData.user_id) === String(id) &&
            !sellData.isSelled &&
            sellData.quantity > 0 &&
            quantity !== 0 &&
            sellData.tradingsymbol === body.tradingsymbol
          ) {
            quantity -= sellData.quantity;
            const order_id = sellData.buyOrderId;
            const random5DigitNumber = generateRandomNumber();
            const sellrequireddata: any = {
              access_key: sellData.access_key,
              id: id,
              tradingsymbol: body.tradingsymbol,
              quantity: quantity,
              exchange: body.exchange,
              order_type: body.order_type,
              product: body.product,
            };

            // sell(sellrequireddata);

            const profit =
              Number(sellData.quantity) *
                Number(body.sellPrice) *
                Number(buyTradeData.loatSize) -
              Number(sellData.quantity) *
                Number(sellData.buyKitePrice) *
                Number(buyTradeData.loatSize);
            console.log(
              sellData.quantity *
                Number(sellData.buyKitePrice) *
                Number(buyTradeData.loatSize)
            );
            await userTrade.updateOne(
              { "trade.user_id": id, "trade.buyOrderId": order_id },
              {
                $set: {
                  "trade.$.isSelled": true,
                  "trade.$.sellAt": indiaTime,
                  "trade.$.sellOrderId": random5DigitNumber,
                  "trade.$.sellKitePrice": body.sellPrice,
                  "trade.$.profit": profit,
                  "trade.$.selltradeStatus": null,
                },
              }
            );

            const data = await userTrade.findOne({
              "trade.user_id": id,
              "trade.buyOrderId": order_id,
            });
            for (const tradeData of data.trade) {
              if (String(tradeData.user_id) === String(id)) {
                return (obj = tradeData);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    return error;
  }
};
