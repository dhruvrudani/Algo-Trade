"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const validation_1 = require("../validation");
const controller_1 = require("../controller");
const jwt_1 = require("../helpers/jwt");
const router = express_1.default.Router();
//registration
router.post('/signup', validation_1.userValidation.signUp, controller_1.userController.signUp); //complete
//otpverificationn
router.post('/otpverification', validation_1.userValidation.verificationOtp, controller_1.userController.OtpVerification); //complete
//update user details
router.patch('/updateuser', validation_1.userValidation.updateuser, controller_1.userController.updateUser); //complete
router.post('/buytrade', controller_1.tradeAction.buystock); //complete
// router.post('/selltrade', userController.sellstock) //complete
router.use(jwt_1.userJWT);
//delete user
router.delete('/delete', validation_1.userValidation.deletes, controller_1.userController.deleteuser); //complete
router.post('/getzeroghadata', controller_1.userController.getUser); //complete
exports.userRouter = router;
//# sourceMappingURL=user.js.map