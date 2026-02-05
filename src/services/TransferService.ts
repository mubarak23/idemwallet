import { sequelize, User, LedgerEntry, TransactionLog } from "../models";
import { v4 as uuidv4 } from "uuid";

interface TransferInput {
  fromUserId: string;
  toUserId: string;
  amount: number;
  idempotencyKey: string;
}

export class TransferService {
  async transfer({ fromUserId, toUserId, amount, idempotencyKey }: TransferInput) {
    // Idempotency
    const existing = await TransactionLog.findOne({ where: { idempotencyKey } });
    if (existing) return existing;

    return await sequelize.transaction(async (t) => {
      // 1. Create PENDING transaction log
      const txLog = await TransactionLog.create(
        { fromUserId, toUserId, amount, idempotencyKey, status: "PENDING" },
        { transaction: t }
      );

      // 2. Lock users
      const fromUser = await User.findByPk(fromUserId, { transaction: t, lock: t.LOCK.UPDATE });
      const toUser = await User.findByPk(toUserId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!fromUser || !toUser) throw new Error("Invalid user");
      if (fromUser.balance < amount) throw new Error("Insufficient funds");

      const transactionId = uuidv4();
      const pendingAccountId = "95369b3b-1298-4994-9f53-8c51a6c43199"; // TODO Find away to get the pending account 

      // 3. Ledger flow: reserve funds
      await LedgerEntry.create(
        { transactionId, accountId: fromUser.id, entryType: "DEBIT", amount, status: "POSTED", referenceType: "TRANSFER", referenceId: txLog.id },
        { transaction: t }
      );

      await LedgerEntry.create(
        { transactionId, accountId: pendingAccountId, entryType: "CREDIT", amount, status: "POSTED", referenceType: "TRANSFER", referenceId: txLog.id },
        { transaction: t }
      );


      // 4. Credit user
      await LedgerEntry.create(
        { transactionId, accountId: pendingAccountId, entryType: "DEBIT", amount, status: "POSTED", referenceType: "TRANSFER", referenceId: txLog.id },
        { transaction: t }
      );


      await LedgerEntry.create(
        { transactionId, accountId: toUser.id, entryType: "CREDIT", amount, status: "POSTED", referenceType: "TRANSFER", referenceId: txLog.id },
        { transaction: t }
      );
 
      //  Update balances
      fromUser.balance =  Number(fromUser.balance) - Number(amount) 
      toUser.balance = Number(toUser.balance) + Number(amount);
      await fromUser.save({ transaction: t });
      await toUser.save({ transaction: t });

     //  Finalize log
      txLog.status = "COMPLETED";
      await txLog.save({ transaction: t });

      return txLog;
    });
  }
}

export default new TransferService();
