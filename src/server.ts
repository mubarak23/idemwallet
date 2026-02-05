import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { sequelize } from "./models";

const PORT = process.env.PORT || 3200;

sequelize.authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection failed:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
