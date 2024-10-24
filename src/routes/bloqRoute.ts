import { Router } from "express";
import { BloqController } from "../controllers/bloqController";
import { validateBody } from "../middlewares/validatorMiddleware";
import { CreateBloqDTO } from "../dto/createBloqDto";

export const bloqRouter = Router();

const bloqController = new BloqController();

bloqRouter.post("/", validateBody(CreateBloqDTO), (req, res) =>
  bloqController.create(req, res)
);
bloqRouter.get("/:id", (req, res) => bloqController.getById(req, res));
bloqRouter.get('/', (req,res) => bloqController.getAll(req, res));
