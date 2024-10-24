import express, { Request, Response, Router } from "express";
import { rentRouter } from "./rentRoute";
import { bloqRouter } from "./bloqRoute";
import { lockerRouter } from "./lockerRoute";

export const routes: Router = express.Router();

routes.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

routes.use("/v1/rents", rentRouter);
routes.use("/v1/bloqs", bloqRouter);
routes.use("/v1/lockers", lockerRouter);
