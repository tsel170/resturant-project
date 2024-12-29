import express from "express";
import { addShift, getShifts } from "../controller/shiftController";

const router = express.Router();

router.post("/addShift", addShift);
router.get("/getShifts", getShifts);

export default router;
