import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

interface Bloq extends Document {
  id: string;
  title: string;
  address: string;
}

const schema = new Schema({
  id: { type: String, default: () => randomUUID(), unique: true, index: true },
  title: { type: String, required: true },
  address: { type: String, required: true },
});

const BloqModel = mongoose.model<Bloq>("Bloq", schema);
export default BloqModel;
