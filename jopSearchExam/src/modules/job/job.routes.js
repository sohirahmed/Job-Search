import { Router } from "express"
import * as JV from "./job.validation.js";
import * as JC from "./job.controller.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { validRoles } from "../../utils/systemRoles.js";
import { multerLocal , validExtension } from "../../middleware/multerLocal.js";

const router = Router()

router.post("/addJob",auth(validRoles.Company_HR),validation(JV.addJobVal),JC.addJob)
router.patch("/updateJob/:id",auth(validRoles.Company_HR),JC.updateJob)
router.patch("/deleteJob/:id",auth(validRoles.Company_HR),JC.updateJob)
router.get("/getAllJobs",auth([validRoles.User,validRoles.Company_HR]),JC.getJobs)
router.get("/getSpecific",auth([validRoles.User,validRoles.Company_HR]),JC.getSpecificJob)
router.get("/filterJobs",auth([validRoles.User,validRoles.Company_HR]),JC.filterJobs)
router.post("/applyToJob/:jobId",multerLocal(validExtension.pdf ,"user/profile").array("pdf" ,3)
,auth(validRoles.User),JC.applyToJob)
export default router

