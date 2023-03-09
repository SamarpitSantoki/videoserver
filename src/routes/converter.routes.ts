import { Router } from "express";
import uploadFile from "../controllers/converter.controller";

const router = Router();

router.post("/upload", uploadFile);

export default router;
