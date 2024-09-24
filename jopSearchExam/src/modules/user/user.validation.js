import coreJoi from "joi"
import joiDate from "@joi/date"
const joi = coreJoi.extend(joiDate)


export const signUp = {
    body: joi.object({
        firstName: joi.string().min(2).max(15).alphanum().required(),
        lastName: joi.string().min(2).max(15).alphanum().required(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','eg'] } }).required(),
        recoveryEmail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','eg'] } }).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        DOB:joi.date().format("YYYY-MM-DD"),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/).required(),
        role: joi.string().valid("User", "Company_HR")
    }).required()
}

export const signIn = {
    body:joi.object({
        email: joi.string().email(),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    
    })
}

export const updateUser = {
    body:joi.object({
        firstName: joi.string().min(2).max(15).alphanum(),
        lastName: joi.string().min(2).max(15).alphanum(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','eg'] } }),
        recoveryEmail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','eg'] } }),
        DOB:joi.date().format("YYYY-MM-DD"),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/),
    })

}