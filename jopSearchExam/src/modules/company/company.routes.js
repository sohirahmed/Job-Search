import { Router } from "express"
import * as CV from "./company.validation.js";
import * as CC from "./company.controller.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
// import { asyncHandler } from "../../utils/errorHandling.js"
import { validRoles } from "../../utils/systemRoles.js";



const router = Router()

router.post("/addCompany",auth(validRoles.Company_HR),validation(CV.addCompany),CC.addCompany)
router.patch("/updateCompany/:id",validation(CV.updateCompany),auth(validRoles.Company_HR),CC.updateCompany)
router.delete("/deleteCompany/:id",validation(CV.deleteCompany),auth(validRoles.Company_HR),CC.deleteCompany)
router.get("/getCompany/:id",auth('Company_HR'),CC.getCompany)
router.get("/search/:companyName",auth(['Company_HR' ,'User']),CC.getCompany)

export default router