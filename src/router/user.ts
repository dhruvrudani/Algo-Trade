import express from 'express'
import { userValidation } from '../validation'
import { tradeAction, userController, planDetails } from '../controller'
import { userJWT } from '../helpers/jwt'
import { test_1 } from '../controller/admin/tradeSummary'
const router = express.Router()

const indiaTimezone = 'Asia/Kolkata';
let buyAT = new Date();
let options = { timeZone: 'Asia/Kolkata', hour12: false };
let indiaTime = buyAT.toLocaleString('en-US', options);

//registration
router.post('/signup', userValidation.signUp, userController.signUp) //complete

//otpverificationn
router.post('/otpverification', userValidation.verificationOtp, userController.OtpVerification) //complete

//update user details
router.patch('/updateuser', userValidation.updateuser, userController.updateUser) //complete

router.post('/buyPlan', planDetails.BuyPlan) //complete

router.use(userJWT)



//delete user
router.delete('/delete', userValidation.deletes, userController.deleteuser) //complete

//buy plan

router.post('/getzeroghadata', userController.getUser) //complete


router.post('/req',test_1)

export const userRouter = router