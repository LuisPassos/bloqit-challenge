import RentModel from "../models/Rent";
import { NotFoundException } from "../exceptions/notFoundException";
import { RentSize, RentStatus } from "../enums/rentEnums";
import { ConflictException } from "../exceptions/conflictException";
import { lockerService } from "./lockerService";
import { LockerStatus } from "../enums/lockerEnums";

class RentService {
  public async getRentByIdOrThrow(id: string) {
    const rent = await RentModel.findOne({ id });
    if (!rent) throw new NotFoundException("Rent not found");
    return rent;
  }

  public getAll() {
    return RentModel.find();
  }

  public create(data: { weight: number; size: RentSize }) {
    return RentModel.create({
      ...data,
      status: RentStatus.CREATED,
    });
  }

  public async reserveLocker(rentId: string, lockerId: string) {
    const rent = await this.getRentByIdOrThrow(rentId);
    const locker = await lockerService.getLockerByIdOrThrow(lockerId);

    this.validateLockerAvailability(locker);
    this.validateRentForLockerAssignment(rent);

    await this.assignLockerToRent(rent, locker);
    return rent.save();
  }

  public async updateStatus(id: string, status: RentStatus) {
    const rent = await this.getRentByIdOrThrow(id);

    if (rent.status === RentStatus.DELIVERED) {
      throw new ConflictException("Parcel already delivered");
    }

    if (this.isInvalidStatusChange(status)) {
      throw new ConflictException("Invalid status change");
    }

    rent.status = status;
    const currentTime = new Date();

    if (status === RentStatus.WAITING_PICKUP) {
      rent.droppedOffAt = currentTime;
    }

    if (status === RentStatus.DELIVERED && rent.lockerId) {
      rent.pickedUpAt = currentTime;
      await this.closeLocker(rent.lockerId);
    }

    return rent.save();
  }

  private validateLockerAvailability(locker: any) {
    if (locker.isOccupied) {
      throw new ConflictException("Locker is occupied");
    }
  }

  private validateRentForLockerAssignment(rent: any) {
    if (rent.lockerId || rent.status !== RentStatus.CREATED) {
      throw new ConflictException("Locker cannot be updated");
    }
  }

  private async assignLockerToRent(rent: any, locker: any) {
    await lockerService.updateStatus(locker.id, {
      status: LockerStatus.CLOSED,
      isOccupied: true,
    });

    rent.lockerId = locker.id;
    rent.status = RentStatus.WAITING_DROPOFF;
  }

  private async closeLocker(lockerId: string) {
    await lockerService.updateStatus(lockerId, {
      status: LockerStatus.CLOSED,
      isOccupied: false,
    });
  }

  private isInvalidStatusChange(status: RentStatus): boolean {
    return (
      status === RentStatus.CREATED || status === RentStatus.WAITING_DROPOFF
    );
  }
}

export const rentService = new RentService();
