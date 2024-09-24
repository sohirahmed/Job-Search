
const dataMethod = ["body" , "query" , "params" , "headers" , "file" , "files"]

export const validation = (schema) =>{

    return(req ,res , next )=>{

        let arrayErrors = []

        dataMethod.forEach((key)=>{
            if(schema[key]){
                const {error} = schema[key].validate(req[key] ,{abortEarly:false}) 
                if(error?.details){
                    error.details.forEach((err)=>{
                        arrayErrors.push(err.message)
                    })
                }
            }
        })

        if(arrayErrors.length){
            return res.status(200).json({msg:"validation error" , errors:arrayErrors})
        }
        next()
    }

}
