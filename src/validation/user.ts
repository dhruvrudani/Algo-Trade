"use strict"
import { Request, Response } from 'express'
import * as Joi from "joi"
import { apiResponse } from '../common'


//user registration
export const signUp = async (req: Request, res: Response, next: any) => {

    var schema = Joi.object({
        phoneNumber: Joi.string()
            .required()
            .pattern(/^[0-9]{10}$/)
            .messages({
                'any.required': 'phoneNumber is required', 'string.pattern.base': 'phoneNumber must be a 10-digit number'
            }),
        role: Joi.number()
            .required()
            .valid(0, 1)
            .messages({
                'any.required': 'role is required',
                'any.only': 'role must be 0 or 1'
            }),
        password: Joi.string()
            .messages({
                'any.required': 'phoneNumber is required', 'string.pattern.base': 'phoneNumber must be a 10-digit number'
            })

    })

    schema.validateAsync(req.body).then(result => {
        return next()
    }).catch(error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}))
    })
}

//verifivstion of OTP

export const verificationOtp = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        phoneNumber: Joi.string()
            .required()
            .pattern(/^[0-9]{10}$/)
            .messages({
                'any.required': 'phoneNumber is required',
                'string.pattern.base': 'phoneNumber must be a 10-digit number'
            }),
        otp: Joi.number().required().messages({ 'any.required': 'Otp is required', 'number.base': 'Otp must be a number' }),
    })
    schema.validateAsync(req.body).then(result => {
        return next()
    }).catch(error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}))
    })
}

//delete the user
export const deletes = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        id: Joi.string().error(new Error('id is required!'))
    })
    schema.validateAsync(req.query).then(result => {
        return next()
    }).catch(error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}))
    })
}


//update user
export const updateuser = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        id: Joi.string().required().error(new Error('id is reqired')),
        fullname: Joi.string().required().error(new Error('name is required!')),
        email: Joi.string()
            .required()
            .pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
            .messages({
                'any.required': 'email is required',
                'string.pattern.base': 'email format must be followed'
            })
    })
    schema.validateAsync(req.body).then(result => {
        return next()
    }).catch(error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}))
    })
}

//det user by id
export const by_id = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        id: Joi.string().error(new Error('id is required!'))
    })
    schema.validateAsync(req.query).then(result => {
        return next()
    }).catch(error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}))
    })
}

