import express, { Express, Request, Response } from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import "express-async-errors";
import { routes } from "./routes";
import morganMiddleware from "./middlewares/morganMiddleware";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morganMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("BloqIT Challenge");
});

app.use("/api", routes);

// 404 Not Found handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    detail: "The requested resource could not be found.",
    status: 404,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
