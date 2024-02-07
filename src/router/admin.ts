import express from 'express'
import { userValidation } from '../validation'
import { tradeAction, userController} from '../controller'
import { userJWT } from '../helpers/jwt'
const router = express.Router()
export const userRouter = router


console.log('"run_adminn_controller"', "run_admin_controller")
router.post('/buytrade', tradeAction.buystock) //complete
router.post('/selltrade', tradeAction.sellstock) //complete
router.post('/quantity', tradeAction.getQuantity) //complete
router.get('/user_quantity',tradeAction.get_user_quantity)

export const adminRouter = router 