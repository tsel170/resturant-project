import express from "express";
import {
  addShift,
  getShifts,
  updateShift,
  deleteShift,
} from "../controller/shiftController.js";

const router = express.Router();

router.post("/addShift", addShift);
router.get("/allShifts", getShifts);
router.put("/updateShift/:id", updateShift);
router.delete("/deleteShift/:id", deleteShift);

export default router;
