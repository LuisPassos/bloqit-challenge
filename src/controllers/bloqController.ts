import { Request, Response } from "express";
import { bloqService } from "../services/bloqService";

export class BloqController {
  public async create(req: Request, res: Response) {
    const bloq = await bloqService.create(req.body);
    res.status(201).json(bloq);
  }

  public async getById(req: Request, res: Response) {
    const bloq = await bloqService.getBloqByIdOrThrow(req.params.id);
    res.status(200).json(bloq);
  }

  public async getAll(req: Request, res: Response) {
    const bloqs = await bloqService.getAll();
    res.status(200).json(bloqs);
  }
}
