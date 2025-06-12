import express, { json } from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import helmet from "helmet";
import { ErrorCodes, Status } from "./models/types";

const app = express();
const PORT = 3000;

//  Add middlewares
app.use(cors());
app.use(json());
app.use(helmet());
// Custom

app.use("/api/user/", userRouter);
app.use((req, res) => {
  res.status(Status.NotFound).json({ error: ErrorCodes.ERR_005 });
});
app.use((req, res) => {
  res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
});

app.listen(PORT, () => {
  console.log("Listening on port -", PORT);
});
