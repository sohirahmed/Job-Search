
export const asyncHandler = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            // res.status(200).json({msg:"catch error" , err})
            next(err)
        })
    }
}

export const globalErrorHandling = (err, req,res,next)=>{
    res.status(err.statusCode || 500).json({msg:"error",err:err.message})
}