import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface LedgerEntryAttributes {
  id: string;
  transactionId: string;
  accountId: string;
  entryType: "DEBIT" | "CREDIT";
  amount: number;
  status: "PENDING" | "POSTED" | "REVERSED";
  referenceType?: string;
  referenceId?: string;
}

interface LedgerEntryCreationAttributes extends Optional<LedgerEntryAttributes, "id"> {}

export class LedgerEntry extends Model<LedgerEntryAttributes, LedgerEntryCreationAttributes>
  implements LedgerEntryAttributes {
  public id!: string;
  public transactionId!: string;
  public accountId!: string;
  public entryType!: "DEBIT" | "CREDIT";
  public amount!: number;
  public status!: "PENDING" | "POSTED" | "REVERSED";
  public referenceType?: string;
  public referenceId?: string;
}

LedgerEntry.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    transactionId: { type: DataTypes.STRING, allowNull: false },
    accountId: { type: DataTypes.UUID, allowNull: false },
    entryType: { type: DataTypes.ENUM("DEBIT", "CREDIT"), allowNull: false },
    amount: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.ENUM("PENDING", "POSTED", "REVERSED"), allowNull: false, defaultValue: "PENDING" },
    referenceType: { type: DataTypes.STRING },
    referenceId: { type: DataTypes.UUID }
  },
  { sequelize, modelName: "LedgerEntry" }
);
