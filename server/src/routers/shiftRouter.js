import express from "express";
import {
  addShift,
  getShifts,
  updateShift,
  deleteShift,
  startShift,
  endShift,
  addTip
} from "../controller/shiftController.js";

const router = express.Router();

router.post("/addShift", addShift);
router.get("/allShifts", getShifts);
router.put("/updateShift/:id", updateShift);
router.delete("/deleteShift/:id", deleteShift);
router.put("/startShift/:userId", startShift);
router.put("/endShift/:userId", endShift);
router.put("/addTip/:userId", addTip);

export default router;
