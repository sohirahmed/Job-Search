import { companyModel } from "../../../DB/models/company.model.js"
import jobModel from "../../../DB/models/job.model.js"
import { AppError } from "../../utils/classError.js"
import { asyncHandler } from "../../utils/errorHandling.js"

//======================================addCompany=====================================

export const addCompany = asyncHandler(async (req, res, next) => {
	const { companyName, description,industry, address, from, to, companyEmail } = req.body
	const isExist = await companyModel.findOne({ companyName })
	if (isExist) {
		return next(new AppError("company name already exists", 409))
	}
	const isCompanyEmail = await companyModel.findOne({ companyEmail })
	if (isCompanyEmail) {
		return next(new AppError("company email already exists", 409))
	}
	const isCompanyOwnerExist = await companyModel.findOne({company_hr:req.user._id})
	if (isCompanyOwnerExist) {
		return next(new AppError("company hr can only have one company", 409))
	}
	const company = await companyModel.create({
		companyName,
		description,
		address,
        industry,
		numberOfEmployees: { from, to },
		companyEmail,
		company_hr: req.user._id,
	})
    res.status(200).json({message:"Done",company})
})

//======================================updateCompany================================================

export const updateCompany = async(req,res,next)=>{
	const {companyName, description, industry, address, from, to, companyEmail} = req.body
	const companyId = req.params.id
	const company = await companyModel.findOne({_id:companyId,company_hr:req.user._id})
	if(!company){
		return next (new  AppError("this company does not exist or does not belong to this user!",404))
	}
	if(companyName){
		const isNameExist = await companyModel.findOne({companyName,_id:{$ne:companyId}})
		if(isNameExist){
			return next (new AppError("this company name already exists!",409))
		}
		company.companyName = companyName
	}
	if(description){
		company.description = description
	}
	if(industry){
		company.industry = industry
	}
	if(address){
		company.address = address
	}
	if(from){
		company.numberOfEmployees.from = from
	}
	if(to){
		company.numberOfEmployees.to = to
	}
	if(companyEmail){
		const isEmailExist = await companyEmail.findOne({companyEmail,_id:{$ne:companyId}})
		if(isEmailExist){
			return next (new AppError("this company email already exists!",409))
		}
		company.companyEmail = companyEmail
	}
	// await company.save()
	await companyModel.updateOne({_id:companyId},{companyName, description, industry, address, from, to, companyEmail})
	res.status(200).json({message:"Done!",company})
}

export const deleteCompany = asyncHandler(async(req,res,next)=>{
	const company = await companyModel.findOneAndDelete({_id:req.params.id,company_hr:req.user._id})
	if(!company){
		return next (new AppError("this company doesn't exist or you don't own this company",404))
	}
	return res.status(200).json(company)
}) 

//================================getCompany================================================

export const getCompany = asyncHandler(async(req,res,next)=>{
	const company = await companyModel.findOne({_id:req.params.id,company_hr:req.user._id}).populate('company_hr')
	if(!company){
		return next(new AppError("company not found",404))
	}

	const jobs = await jobModel.find({addedBy:company.company_hr})

	var result = company.toObject()
	result.jobs = jobs
	
	res.status(200).json({message:'Done',result})
})

//======================================searchCompanyByName==================================

export const searchCompanyByName = asyncHandler(async(req,res,next)=>{
    const searchQuery = req.query.companyName
    const companies = await companyModel.find({companyName:{$regex:searchQuery}})
    res.status(200).json({message:"Done!",companies})
})