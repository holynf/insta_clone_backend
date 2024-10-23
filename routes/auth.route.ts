import controller from "../controllers/auth";
import express from "express";
import { userRegistrationSchema, userLoginSchema } from "../interfaces/models/user";
const router = express.Router();
import { validateData } from "../middleware/validationMiddleware";

router.post("/register", validateData(userRegistrationSchema), controller.register);
router.post("/login", validateData(userLoginSchema), controller.login);

module.exports = router;
