import express, { json, NextFunction, Request, Response } from "express";
import cors from "cors";
import userRouter from "./v1/routes/user.route";
import helmet from "helmet";
import { ErrorCodes, Status } from "./v1/models/types";
import authRouter from "./v1/routes/auth.route";
import dotenv from "dotenv";
import { logger } from "./winston";

dotenv.config();
logger.info("Server Started");
const app = express();
const PORT = process.env.PORT;

//  Add middlewares
app.use(cors());
app.use(json());
app.use(helmet());

// Routes
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/auth/", authRouter);

// For invalid routes
app.use((req: Request, res: Response) => {
  logger.error(`Main Logger - ${req.method} failed for ${req.url}`);
  res.status(Status.NotFound).end();
});
app.use((req: Request, res: Response) => {
  logger.error(`Main logger - Internal Server Error`);
  res.status(Status.InternalServerError).json({ error: ErrorCodes.ERR_006 });
});

// To catch errors in payload JSON formatting - This is actually a general error handler - Need to read about this more
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(Status.BadRequest).json({ error: ErrorCodes.ERR_008 });
    return;
  }
  next(err);
});

app.listen(PORT, () => {
  console.log("Listening on port -", PORT);
});

export default app;
