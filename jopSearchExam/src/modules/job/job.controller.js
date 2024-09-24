import applicationModel from "../../../DB/models/application.model.js"
import { companyModel } from "../../../DB/models/company.model.js"
import jobModel from "../../../DB/models/job.model.js"
import { AppError } from "../../utils/classError.js"
import { asyncHandler } from "../../utils/errorHandling.js"

//========================================addJob========================================

export const addJob = asyncHandler(async (req, res, next) => {
	const {
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
	} = req.body

	const job = await jobModel.create({
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
        addedBy:req.user._id
	})
	return res.json({message:"Done",job})
})

//===========================================updateJob==========================================

export const updateJob = asyncHandler(async(req,res,next)=>{
	const {
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
	} = req.body
	const job = await jobModel.findOne({_id:req.params.id,addedBy:req.user._id})
	if(!job){
		return next (new AppError("this job is not found or you do not own this job",404))
	}
	if(jobTitle){
		job.jobTitle = jobTitle
	}
	if(jobLocation){
		job.jobLocation = jobLocation
	}
	if(workingTime){
		job.workingTime = workingTime
	}
	if(seniorityLevel){
		job.seniorityLevel = seniorityLevel
	}
	if(jobDescription){
		job.jobDescription = jobDescription
	}
	if(technicalSkills){
		job.technicalSkills = technicalSkills
	}
	if(softSkills){
		job.softSkills = softSkills
	}
	const jobUpdate = await jobModel.findOneAndUpdate({_id:req.params.id},{
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
	},{new:true})
	// await job.save()
	return res.json({message:"Done!",jobUpdate})
})
//=============================================deleteJob============================================

export const deleteJob = asyncHandler(async(req,res,next)=>{
    const job = await jobModel.findOne({_id:req.params.id,addedBy:req.user._id})
    if(!job){
        return next (new AppError("this job is not found or you do not own this job",404))
    }
    await job.remove()
    return res.status(200).json({message:"Done! Job deleted"})
})

//========================================getJobs==================================================

export const getJobs = asyncHandler(async(req,res,next)=>{
	const jobs = await jobModel.find({})
	let results = []
	for(const job of jobs){
		const companies = await companyModel.find({company_hr:job.addedBy})
		const objJob = job.toObject()
		objJob.companies = companies
		results.push(objJob)
	}
	return res.status(200).json({message:"Done!",results})
})

//======================================getSpecificJob======================================

export const getSpecificJob = asyncHandler(async(req,res,next)=>{
	const company = await companyModel.findOne({companyName:req.query.companyName})
	if(!company){
		return next (new AppError("compny not found!",404))
	}
	const jobs = await jobModel.find({addedBy:company.company_hr})
	return res.status(200).json({message:"Done!",jobs})
})

//=====================================filterJob================================================

export const filterJobs = asyncHandler(async(req,res,next)=>{
	let filterQuery = {}
	if(req.query?.jobTitle){
		filterQuery.jobTitle = req.query.jobTitle
	}
	if(req.query?.jobLocation){
		filterQuery.jobLocation = req.query.jobLocation
	}
	if(req.query?.workingTime){
		filterQuery.workingTime = req.query.workingTime
	}
	if(req.query?.seniorityLevel){
		filterQuery.seniorityLevel = req.query.seniorityLevel
	}
	if(req.query?.technicalSkills){
		filterQuery.technicalSkills = req.query.technicalSkills
	}
	console.log({filterQuery})
	const jobs = await jobModel.find(filterQuery)
	res.status(200).json({message:"Done!",jobs})
})

//===========================================applyToJob==========================================

export const applyToJob = asyncHandler(async(req,res,next)=>{
	const {userSoftSkills,userTechSkills} = req.body
	const jobId = req.params.jobId
	const userId = req.user._id
	const job = await jobModel.find({_id:jobId})
	if(!job){
		return next (new Error("job not found",404))
	}

    if(!req.files.length){
        return next(new AppError("file not found" ,400))
    }

    let arrayPaths = []
    for (const file of req.files) {
        console.log(file.path)
        arrayPaths.push(file.path)
    }

	const application = await applicationModel.create({userSoftSkills,userTechSkills,userId,jobId})
	return res.status(200).json({message:"Done!",application})
})