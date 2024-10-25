import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";
import { RentSize, RentStatus } from "../enums/rentEnums";

interface Rent extends Document {
  id: string;
  lockerId: string | null;
  weight: number;
  size: RentSize;
  status: RentStatus;
  createdAt: Date;
  droppedOffAt: Date | null;
  pickedUpAt: Date | null;
}

const schema = new Schema({
  id: { type: String, default: () => randomUUID(), unique: true, index: true },
  lockerId: { type: String, ref: "Locker", default: null },
  weight: { type: Number, required: true },
  size: { type: String, enum: RentSize, required: true },
  status: {
    type: String,
    enum: RentStatus,
    required: true,
    default: RentStatus.CREATED,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  droppedOffAt: { type: Date, default: null },
  pickedUpAt: { type: Date, default: null },
});

const RentModel = mongoose.model<Rent>("Rent", schema);
export default RentModel;
