import joi from "joi"

export const addJobVal = {
    body:joi.object({
        jobTitle:joi.string().required(),
		jobLocation:joi.string().required(),
		workingTime:joi.string().valid('part-time','full-time').required(),
		seniorityLevel:joi.string().required(),
		jobDescription:joi.string().required(),
		technicalSkills:joi.array().required(),
		softSkills:joi.array().required(),
    })
}