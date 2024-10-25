import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";
import { LockerStatus } from "../enums/lockerEnums";

interface Locker extends Document {
  id: string;
  bloqId: string;
  status: LockerStatus;
  isOccupied: boolean;
}

const schema = new Schema({
  id: { type: String, default: () => randomUUID(), unique: true, index: true },
  bloqId: { type: String, ref: "Bloq", required: true },
  status: {
    type: String,
    enum: LockerStatus,
    required: true,
    default: LockerStatus.CLOSED,
  },
  isOccupied: { type: Boolean, required: true, default: false },
});

const LockerModel = mongoose.model<Locker>("Locker", schema);
export default LockerModel;
