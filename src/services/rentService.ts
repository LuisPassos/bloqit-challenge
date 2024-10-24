import RentModel from "../models/rentModel";
import { NotFoundException } from "../exceptions/notFoundException";
import { RentSize, RentStatus } from "../enums/rentEnums";
import { ConflictException } from "../exceptions/conflictException";
import { lockerService } from "./lockerService";
import { LockerStatus } from "../enums/lockerEnums";

class RentService {
  public async getRentByIdOrThrow(id: string) {
    const rent = await RentModel.findOne({ id });

    if (!rent) {
      throw new NotFoundException("Rent does not exist");
    }

    return rent;
  }

  public async getAll() {
    return await RentModel.find();
  }

  public async create(data: { weight: number; size: RentSize }) {
    const { weight, size } = data;
    return await RentModel.create({ weight, size, status: RentStatus.CREATED });
  }

  public async reserveLocker(id: string, lockerId: string) {
    const rent = await this.getRentByIdOrThrow(id);
    const locker = await lockerService.getLockerByIdOrThrow(lockerId);

    if (locker.isOccupied) {
      throw new ConflictException("Locker is occupied");
    }

    if (rent.lockerId !== null || rent.status !== RentStatus.CREATED) {
      throw new ConflictException("Locker can't be updated.");
    }

    await lockerService.updateStatus(locker.id, {
      status: LockerStatus.CLOSED,
      isOccupied: true,
    });

    rent.lockerId = locker.id;
    rent.status = RentStatus.WAITING_DROPOFF;

    return await rent.save();
  }

  public async updateStatus(id: string, status: RentStatus) {
    const rent = await this.getRentByIdOrThrow(id);

    if (rent.status === RentStatus.DELIVERED) {
      throw new ConflictException("Parcel already delivered");
    }

    if (
      status === RentStatus.CREATED ||
      status === RentStatus.WAITING_DROPOFF
    ) {
      throw new ConflictException(
        "You cant't recreate or allocate locker to parcel again"
      );
    }

    rent.status = status;

    if (status === RentStatus.DELIVERED && rent.lockerId) {
      await lockerService.updateStatus(rent.lockerId, {
        status: LockerStatus.CLOSED,
        isOccupied: false,
      });
    }

    return await rent.save();
  }
}

export const rentService = new RentService();
