import { Router } from "express";
import InterestService from "../services/InterestService";

const router = Router();


router.get("/calculate",  async (req, res) => {
  try {
    const tx = await InterestService.applyDailyInterest();
    res.json({ message: "Interest calculated successful", transaction: tx });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})

export default router;
