import express from "express";
import transferRoutes from "./routes/transfer";
import interestRoutes from "./routes/interest";

const app = express();
app.use(express.json());
// TODO:  add rate limit on the endpoint
app.use("/api/transfer", transferRoutes);
app.use("/api/interest", interestRoutes);

export default app;