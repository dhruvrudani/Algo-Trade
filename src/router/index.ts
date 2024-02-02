import { Router } from 'express'
import { userRouter } from './user'
const router = Router()

//user router
router.use('/user', userRouter)


export { router }

