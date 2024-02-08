import express from 'express'
import { userValidation } from '../validation'
import { tradeAction, userController,tradeSummary} from '../controller'
import { userJWT } from '../helpers/jwt'
const router = express.Router()
export const userRouter = router


console.log('"run_adminn_controller"', "run_admin_controller")
router.post('/buytrade', tradeAction.buystock) //complete
router.post('/selltrade', tradeAction.sellstock) //complete
router.post('/quantity', tradeAction.getQuantity) //complete
router.get('/user_quantity',tradeSummary.get_user_quantity)
router.get('/get_trade',tradeSummary.trade_get)
router.get('/user_get_trade',tradeSummary.user_trade_get)

export const adminRouter = router 