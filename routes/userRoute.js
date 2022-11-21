import { Router } from "express";
import { loginController } from "../controllers/userController.js";


const router = Router();

router.route("/").get(loginController);

export default router;