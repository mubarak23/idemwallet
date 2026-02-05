import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface UserAttributes {
  id: string;
  name?: string;
  balance: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "balance"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name?: string;
  public balance!: number;
}

User.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING },
    balance: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 }
  },
  { sequelize, modelName: "User" }
);
