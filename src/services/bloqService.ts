import { NotFoundException } from "../exceptions/notFoundException";
import BloqModel from "../models/Bloq";

class BloqService {
  public async getBloqByIdOrThrow(id: string) {
    const bloq = await BloqModel.findOne({ id });

    if (!bloq) {
      throw new NotFoundException("Bloq does not exist");
    }

    return bloq;
  }

  public async getAll() {
    return await BloqModel.find();
  }

  public async create(data: { title: string; address: string }) {
    const { title, address } = data;
    return await BloqModel.create({ title, address });
  }
}

export const bloqService = new BloqService();
