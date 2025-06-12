import express, { json } from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(json());
app.use("/api/user/", userRouter);

app.listen(PORT, () => {
  console.log("Listening on port -", PORT);
});
