import { Router } from "express";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { getMeController, loginController, registerController, verifyEmail } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register", registerValidator, registerController)

authRouter.post("/login", loginValidator, loginController)

authRouter.get("/get-me", authUser, getMeController)

authRouter.get("/verify-email", verifyEmail)


export default authRouter;