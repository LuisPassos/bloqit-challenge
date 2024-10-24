import { Router } from "express";
import { RentController } from "../controllers/rentController";
import { CreateRentDTO } from "../dto/createRentDto";
import { validateBody } from "../middlewares/validatorMiddleware";
import { ReserveLockerDTO } from "../dto/reserveLocker.dto";
import { UpdateRentStatusDTO } from "../dto/updateRentStatusDto";

export const rentRouter = Router();

const rentController = new RentController();

rentRouter.post("/", validateBody(CreateRentDTO), (req, res) =>
  rentController.create(req, res)
);
rentRouter.get(
  "/:id",
  async (req, res) => await rentController.getById(req, res)
);
rentRouter.get("/", (req, res) => rentController.getAll(req, res));
rentRouter.patch("/:id/reserve", validateBody(ReserveLockerDTO), (req, res) =>
  rentController.reserve(req, res)
);
rentRouter.patch("/:id/status", validateBody(UpdateRentStatusDTO), (req, res) =>
  rentController.status(req, res)
);
