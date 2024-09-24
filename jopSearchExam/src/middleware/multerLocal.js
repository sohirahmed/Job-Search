
import multer from "multer";
import { nanoid } from "nanoid";
import { AppError } from "../utils/classError.js";
import path from 'path'
import fs from 'fs'

export const validExtension = {
    image:["image/jpeg" , "image/jpg" , "image/png"],
    pdf:["application/pdf"],
    video:["video/mp4" , "video/mkv"]
}

export const multerLocal =(customValidation =["image/png"] , customPath =["General"])=>{

    const allPath = path.resolve(`uploads/${customPath}`)
    if(!fs.existsSync(allPath)){
        fs.mkdirSync(allPath , {recursive:true})
    }

    //1-destination
    //2-fileName

    const storage = multer.diskStorage({
        destination:function(req , file , cb){
            cb(null , allPath)
        },
        filename:function(req , file , cb){
            console.log(file);
            cb(null , nanoid(5) + file.originalname)
        }
    })

    const fileFilter = function(req , file ,cb){
        if(customValidation.includes(file.mimetype) ){
            return cb(null , true)
        }
        cb(new AppError("file not supported"),false)
    }

    const upload = multer({fileFilter,storage})
    return upload
}