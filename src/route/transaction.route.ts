import express from "express";
import downloadTransaction from "../controllers/restful/transaction.controller.js";

const router = express.Router();

router.get("/download/:userId", downloadTransaction);
export default router;
