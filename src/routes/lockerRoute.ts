import { Router } from "express";
import { LockerController } from "../controllers/lockerController";
import { validateBody } from "../middlewares/validatorMiddleware";
import { CreateLockerDTO } from "../dto/createLockerDto";
import { UpdateLockerStatusDTO } from "../dto/updateLockerStatusDto";

export const lockerRouter = Router();

const lockerController = new LockerController();

lockerRouter.post("/", validateBody(CreateLockerDTO), (req, res) =>
  lockerController.create(req, res)
);
lockerRouter.get("/:id", (req, res) => lockerController.getById(req, res));
lockerRouter.get("/", (req, res) => lockerController.getAll(req, res));
lockerRouter.patch(
  "/:id/status",
  validateBody(UpdateLockerStatusDTO),
  (req, res) => lockerController.updateStatus(req, res)
);
lockerRouter.get("/free/:bloqId", (req, res) =>
  lockerController.free(req, res)
);
