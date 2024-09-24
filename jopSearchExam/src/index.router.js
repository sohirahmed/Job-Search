import path from "path"
import { config } from "dotenv"
config({ path: path.resolve("config/.env") })
import { dbConnection } from "../DB/dbConnection.js"
import userRoutes from "./modules/user/user.routes.js"
import companyRoutes from "./modules/company/company.routes.js"
import jobRoutes from "./modules/job/job.routes.js"
import { globalErrorHandling } from './utils/errorHandling.js';


export const bootstrap = (app, express) => {
    app.use(express.json())
    app.use("/user", userRoutes)
    app.use("/company",companyRoutes)
    app.use("/job",jobRoutes)
    app.use('*', (req, res, next) => res.json({ msg: `${req.originalUrl} is invalid url!` }))
    dbConnection()
    app.use(globalErrorHandling)
}

