import { sequelize } from "../config/database";
import { User } from "./User";
import { LedgerEntry } from "./LedgerEntry";
import { TransactionLog } from "./TransactionLog";

// Optional associations
User.hasMany(LedgerEntry, { foreignKey: "accountId", sourceKey: "id" });
LedgerEntry.belongsTo(User, { foreignKey: "accountId", targetKey: "id" });

export { sequelize, User, LedgerEntry, TransactionLog };
