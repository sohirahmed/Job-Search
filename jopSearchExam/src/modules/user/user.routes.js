import { Router } from "express"
import * as UV from "./user.validation.js";
import * as UC from "./user.controller.js";
import { validation,  } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";


const router = Router()

router.post("/signUp", validation(UV.signUp), UC.signUp)
router.post("/signIn",validation(UV.signIn),UC.signIn)
router.patch("/updateAccount",auth('Company_HR'),UC.updateAccount)
router.delete('/deleteAccount' ,auth('Company_HR'), UC.deleteAccount)
router.get('/getUserAccountData' , auth("Company_HR"), UC.getUserAccountData)
router.get('/getProfileDataForAnotherUser/:id' , auth("User") , UC.getProfileDataForAnotherUser)
router.patch('/updatePassword' ,auth('User') , UC.updatePassword)
router.post('/forgetPassword' ,auth('User') , UC.forgetPassword)
router.post('/reset/:token' ,auth('User') , UC.resetPassword)
router.get('/specificRecovery/:email' , auth("User") , UC.getAllAccountsAssociatedToASpecificRecoveryEmail)

export default router