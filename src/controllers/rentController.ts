import { Request, Response } from "express";
import { rentService } from "../services/rentService";

export class RentController {
  public async create(req: Request, res: Response) {
    const rent = await rentService.create(req.body);
    res.status(201).json(rent);
  }

  public async getById(req: Request, res: Response) {
    const rent = await rentService.getRentByIdOrThrow(req.params.id);
    res.status(200).json(rent);
  }

  public async getAll(req: Request, res: Response) {
    const rents = await rentService.getAll();
    res.status(200).json(rents);
  }

  public async reserve(req: Request, res: Response) {
    const rent = await rentService.reserveLocker(
      req.params.id,
      req.body.lockerId
    );
    res.status(200).json(rent);
  }

  public async status(req: Request, res: Response) {
    const rent = await rentService.updateStatus(req.params.id, req.body.status);

    res.status(200).json(rent);
  }
}
