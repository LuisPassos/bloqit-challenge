import { LockerStatus } from "../enums/lockerEnums";
import { NotFoundException } from "../exceptions/notFoundException";
import LockerModel from "../models/lockerModel";
import { bloqService } from "./bloqService";

class LockerService {
  public async getLockerByIdOrThrow(id: string) {
    const locker = await LockerModel.findOne({ id });

    if (!locker) {
      throw new NotFoundException("Locker does not exist");
    }

    return locker;
  }

  public async create(bloqId: string) {
    const bloq = await bloqService.getBloqByIdOrThrow(bloqId);
    return await LockerModel.create({ bloqId: bloq.id });
  }

  public async getAll() {
    return await LockerModel.find();
  }

  public async updateStatus(
    id: string,
    data: { status: LockerStatus; isOccupied: boolean }
  ) {
    const locker = await LockerModel.findOneAndUpdate(
      { id },
      { $set: { status: data.status, isOccupied: data.isOccupied } },
      { new: true, runValidators: true }
    );

    if (!locker) {
      throw new NotFoundException("Locker does not exist");
    }

    return locker;
  }

  public async findFree(bloqId: string) {
    const bloq = await bloqService.getBloqByIdOrThrow(bloqId);

    return await LockerModel.findOne({
      bloqId: bloq.id,
      isOccupied: false,
    });
  }
}

export const lockerService = new LockerService();
