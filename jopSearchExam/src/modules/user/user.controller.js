import userModel from "../../../DB/models/user.model.js"
import { asyncHandler } from "../../utils/errorHandling.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { nanoid } from 'nanoid'
import { AppError } from "../../utils/classError.js"

//======================================signUp===========================================================

export const signUp = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, recoveryEmail, password, DOB, phone, role } = req.body
    const emailExist = await userModel.findOne({ email })
    if (emailExist) {
        return next(new AppError("user already exist", 400))
    }

    const hash = bcrypt.hashSync(password, +process.env.SALT_ROUND)
    const user = await userModel.create({ firstName, lastName, email, recoveryEmail, password: hash, DOB, phone, role })
    user ? res.status(201).json({ msg: "done", user }) : next(new AppError("failed to save user", 500))
})

//================================================signIn=======================================================

export const signIn = asyncHandler(async(req,res,next)=>{
    const {email,password,phone} = req.body
    const userExist = await userModel.findOne({
        $or:[
            {email:email},
            {phone}
        ]
    })
    if(!userExist){
        return next (new AppError("in-valid credentials",404))
    }
    const match = bcrypt.compareSync(password,userExist.password)
    if(!match){
        return next (new AppError("in-valid credentials",404))
    }
    const token = jwt.sign({id:userExist._id,email,role:userExist.role},process.env.TOKEN_SIGNATURE)
    await userModel.updateOne({_id:userExist._id},{status:true})
    return res.json({message:"Signed-In",token})
})

//==========================================updateAccount====================================================================

export const updateAccount = asyncHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.user._id)
    const {firstName,lastName,email,DOB,phone,recoveryEmail} = req.body
    if(!user){
        return next(new AppError("user not found",404))
    }
    if(firstName){
        user.firstName = firstName
        user.userName =firstName + " " +user.lastName
    }
    if(lastName){
        user.lastName = lastName
        user.userName =firstName + " " +user.lastName

    }
    if(DOB){
        user.DOB = DOB
    }
    if(phone){
        const phoneExist = await userModel.findOne({phone})
        if(phoneExist){
            return next(new AppError("phone already exists",409))
        }
        user.phone = phone
    }
    if(email){
        const emailExist = await userModel.findOne({email})
        if(emailExist){
            return next(new AppError("email already exists",409))
        }
        user.email=email
    }
    if(recoveryEmail){
        user.recoveryEmail = recoveryEmail
    }
    const{token} = req.headers
    const decoded = jwt.verify(token , process.env.TOKEN_SIGNATURE)
    if(!decoded){
        return next(new AppError("token not valid" ,400))
        // return res.status(400).json({msg:"token not valid"})
    }

    await user.save()
    res.status(200).json({message:"Done!",user})
})

//==========================================deleteAccount============================================

export const deleteAccount = asyncHandler(async(req,res,next)=>{
    const{token} = req.headers
    const decoded = jwt.verify(token , process.env.TOKEN_SIGNATURE)
    if(!decoded){
        return next(new AppError("token not valid" ,400))
    }
    const user = await userModel.findByIdAndDelete(decoded.id )
    if(!user){
        return next(new AppError("user not found" ,400))
    }
    res.status(200).json({msg:"done" })
})

//===================================getUserAccountData======================================

export const getUserAccountData = asyncHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.user._id).select("-password")
    if(!user){
        return next(new AppError("user not found",404))
    }
    res.status(200).json(user)
})

//====================================getProfileDataForAnotherUser==================================

export const getProfileDataForAnotherUser = asyncHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.params.id).select("-password")
    if(!user){
        return next(new AppError("user not found",404))
    }
    res.status(200).json(user)
})

//====================================updatePassword==================================================

export const updatePassword = asyncHandler(async(req,res,next)=>{
    const {oldPassword, newPassword} = req.body
    const user = await userModel.findById(req.user._id)
    if(!user){
        return next(new AppError("user not found",404))
    }
    const match = bcrypt.compareSync(oldPassword,user.password)
    if(!match){
        return next(new AppError("in-valid old password",400))
    }
    const hash = bcrypt.hashSync(newPassword, +process.env.SALT_ROUND)
    user.password = hash
    await user.save()
    res.status(200).json({message:"done"})
})


//===================================forgetPassword===================================================

export const forgetPassword = asyncHandler(async (req,res,next)=>{
    const code = nanoid()
    await userModel.updateOne({email:req.body.email},{code})
    return res.json(code)
})

//====================================resetPassword=================================================
export const resetPassword = asyncHandler(async(req,res,next)=>{
    const userExist = await userModel.findOne({email:req.body.email,code:req.body.code})
    if(!userExist){
        return next(new AppError("user doesn't Exist or invalid code"))
    }
    const password = bcrypt.hashSync(req.body.password,+process.env.SALT_ROUND)
    await userModel.updateOne({email},{password})
    return res.status(200).json({message:"password successfully reset"})
})

//=======================================getAllAccountsAssociatedToASpecificRecoveryEmail===================================

export const getAllAccountsAssociatedToASpecificRecoveryEmail = asyncHandler(async(req,res,next)=>{
    const user = await (await userModel.find({recoveryEmail:req.params.recoveryEmail}).select("-password"))
    if(!user){
        return next(new AppError("user not found",404))
    }
    res.status(200).json(user)
})



