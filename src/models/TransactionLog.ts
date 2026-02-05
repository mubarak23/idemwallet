import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface TransactionLogAttributes {
  id: string;
  idempotencyKey: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

interface TransactionLogCreationAttributes extends Optional<TransactionLogAttributes, "id" | "status"> {}

export class TransactionLog extends Model<TransactionLogAttributes, TransactionLogCreationAttributes>
  implements TransactionLogAttributes {
  public id!: string;
  public idempotencyKey!: string;
  public fromUserId!: string;
  public toUserId!: string;
  public amount!: number;
  public status!: "PENDING" | "COMPLETED" | "FAILED";
}

TransactionLog.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    idempotencyKey: { type: DataTypes.STRING, allowNull: false, unique: true },
    fromUserId: { type: DataTypes.UUID, allowNull: false },
    toUserId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"), allowNull: false, defaultValue: "PENDING" }
  },
  { sequelize, modelName: "TransactionLog" }
);
