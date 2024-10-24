import { Request, Response } from "express";
import { lockerService } from "../services/lockerService";

export class LockerController {
  public async create(req: Request, res: Response) {
    const locker = await lockerService.create(req.body.bloqId);
    res.status(201).send(locker);
  }

  public async getById(req: Request, res: Response) {
    const locker = await lockerService.getLockerByIdOrThrow(req.params.id);
    res.status(200).json(locker);
  }

  public async getAll(req: Request, res: Response) {
    const lockers = await lockerService.getAll();
    res.status(200).json(lockers);
  }

  public async updateStatus(req: Request, res: Response) {
    const locker = await lockerService.updateStatus(req.params.id, {
      status: req.body.status,
      isOccupied: req.body.isOccupied,
    });
    res.status(200).json(locker);
  }

  public async free(req: Request, res: Response) {
    const locker = await lockerService.findFree(req.params.bloqId);

    if (!locker) {
      res
        .status(200)
        .json({ message: "All lockers are occupied in this bloq" });
    }

    res.status(200).json(locker);
  }
}
