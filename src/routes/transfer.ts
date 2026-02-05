import { Router } from "express";
import transferService from "../services/TransferService";

const router = Router();

router.post("/", async (req, res) => {
  const { fromUserId, toUserId, amount, idempotencyKey } = req.body;
  try {
    const tx = await transferService.transfer({ fromUserId, toUserId, amount, idempotencyKey });
    res.json({ message: "Transfer successful", transaction: tx });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



export default router;
