import userModel from '../../DB/models/user.model.js'
import jwt from 'jsonwebtoken'

export const auth = (roles =[])=>{
    return async(req,res,next)=>{
        try{

            const {token} = req.headers
            if(!token){
                return res.status(400).json({msg:"token not found"})
            }
            if(!token.startsWith("exam__")){
                return res.status(400).json({msg:"token notValid"})
            }
            const newToken = token.split("exam__")[1]
            if(!newToken){
                return res.status(400).json({msg:"token not found"})
            }
            console.log(newToken);

            const decoded = jwt.verify(newToken , process.env.TOKEN_SIGNATURE)
            console.log(decoded);
            if(!decoded?.id){
                return res.status(400).json({msg:"invalid payload"})
            }
        
            const user = await userModel.findById(decoded.id)
            if(!user){
                return res.status(400).json({msg:"user not found"})
            }
            //authorization
            if(!roles.includes(user.role)){
                return res.status(403).json({msg:"you not authorized"})
            }
            req.user = user
            next()

        }catch(error){
            return res.status(400).json({msg:"catch error",error})
        }
    }
}

