import express from "express";
import { userLoginSchema, userRegistrationSchema } from "../interfaces/models/user";
import { validateData } from "../middleware/validationMiddleware";
import AuthLogin from "../controllers/auth/Login";
import AuthRegister from "../controllers/auth/Register";

const router = express.Router();

router.post("/register", validateData(userRegistrationSchema), AuthLogin);
router.post("/login", validateData(userLoginSchema), AuthRegister);

export default router;
