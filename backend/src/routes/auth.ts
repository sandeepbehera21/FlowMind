import { Router } from "express";
import { me } from "../controllers/authController.js";

export const authRouter = Router();
authRouter.get("/me", me);
