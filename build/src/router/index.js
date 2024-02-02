"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_1 = require("./user");
const router = (0, express_1.Router)();
exports.router = router;
//user router
router.use('/user', user_1.userRouter);
//# sourceMappingURL=index.js.map