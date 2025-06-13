import express, { json, Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import helmet from "helmet";
import { ErrorCodes, Status } from "./models/types";
import loginRouter from "./routes/login.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//  Add middlewares
app.use(cors());
app.use(json());
app.use(helmet());

// Functions
const verifyToken = () => {};

// Routes
app.use("/api/user/", userRouter);
app.use("/api/login/", loginRouter);

// For invalid routes
app.use((req, res) => {
  res.status(Status.NotFound).json({ error: ErrorCodes.ERR_005 });
});
app.use((req, res) => {
  res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
});

// To catch errors in payload JSON formatting - This is actually a general error handler - Need to read about this more
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_008 });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log("Listening on port -", PORT);
});
