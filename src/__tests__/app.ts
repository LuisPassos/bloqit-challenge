import mongoose, { mongo } from "mongoose";
import app from "../app";
import supertest from "supertest";
import { LockerStatus } from "../enums/lockerEnums";
import { RentSize, RentStatus } from "../enums/rentEnums";

const request = supertest(app);

console.log("Running tests...");

let bloqId: string;
let lockerId: string;
let rentId: string;

describe("GET /", () => {
  it('should return "BloqIT Challenge"', async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("BloqIT Challenge");
  });
});

describe("POST /bloqs", () => {
  let connection: typeof mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
    );
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should return 201 on valid title and address", async () => {
    const response = await request
      .post("/api/v1/bloqs")
      .send({
        title: "Luitton Vouis Champs Elysées",
        address: "101 Av. des Champs-Élysées, 75008 Paris, France",
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      title: "Luitton Vouis Champs Elysées",
      address: "101 Av. des Champs-Élysées, 75008 Paris, France",
    });
    expect(response.body).toHaveProperty("id");
    bloqId = response.body.id;
  });

  it("should return 400 (Bad Request Exception) on empty title", async () => {
    const response = await request
      .post("/api/v1/bloqs")
      .send({
        title: "",
        address: "101 Av. des Champs-Élysées, 75008 Paris, France",
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 (Bad Request Exception) on empty address", async () => {
    const response = await request
      .post("/api/v1/bloqs")
      .send({
        title: "Luitton Vouis Champs Elysées",
        address: "",
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /bloqs", () => {
  let connection: typeof mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
    );
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should return 200 and a list of bloqs", async () => {
    const response = await request.get("/api/v1/bloqs");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach(
      (bloq: { title: string; address: string; id: string }) => {
        expect(bloq).toHaveProperty("title");
        expect(bloq).toHaveProperty("address");
        expect(bloq).toHaveProperty("id");

        expect(typeof bloq.title).toBe("string");
        expect(typeof bloq.address).toBe("string");
      }
    );
  });

  describe("GET /bloqs/:id", () => {
    let connection: typeof mongoose;

    beforeAll(async () => {
      connection = await mongoose.connect(
        `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
      );
    });

    afterAll(async () => {
      await connection.disconnect();
    });

    it("should return 200 and the requested bloq", async () => {
      const response = await request.get(`/api/v1/bloqs/${bloqId}`);
      expect(response.statusCode).toBe(200);

      expect(response.body).toMatchObject({
        title: "Luitton Vouis Champs Elysées",
        address: "101 Av. des Champs-Élysées, 75008 Paris, France",
        id: bloqId,
      });
    });

    it("should return 404 if bloqId doesn't exist", async () => {
      const response = await request.get(`/api/v1/bloqs/4`);
      expect(response.statusCode).toBe(404);

      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("detail");
    });
  });
});

describe("POST /locker", () => {
  let connection: typeof mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
    );
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should return 201 on valid request", async () => {
    const response = await request
      .post("/api/v1/lockers")
      .send({
        bloqId,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      bloqId,
      status: LockerStatus.CLOSED,
      isOccupied: false,
    });
    expect(response.body).toHaveProperty("id");
    lockerId = response.body.id;
  });

  it("should return 400 (Bad Request) on non UUID bloqId", async () => {
    const response = await request
      .post("/api/v1/lockers")
      .send({
        bloqId: "4",
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
  });

  it("should return 404 (Not Found Request) on invalid bloqId", async () => {
    const response = await request
      .post("/api/v1/lockers")
      .send({
        bloqId: "43732485-95fd-42e0-bde2-7c2705dd602f",
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(404);
  });
});

describe("PATCH /lockers/:id/status", () => {
  let connection: typeof mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
    );
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should return 200 on open locker request", async () => {
    const response = await request
      .patch(`/api/v1/lockers/${lockerId}/status`)
      .send({
        status: LockerStatus.OPEN,
        isOccupied: false,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      bloqId,
      status: LockerStatus.OPEN,
      isOccupied: false,
      id: lockerId,
    });
  });

  it("should return 400 on bad request", async () => {
    const response = await request
      .patch("/api/v1/lockers/${lockerId}/status")
      .send({
        status: "LockerStatus",
        isOccupied: false,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
  });

  it("should return 404 on non existent lockerId", async () => {
    const response = await request
      .patch("/api/v1/lockers/4/status")
      .send({
        status: LockerStatus.OPEN,
        isOccupied: false,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(404);

    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("detail");
  });
});

describe("PATCH /lockers/:id/status", () => {
  let connection: typeof mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
    );
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should return 200 on free locker request", async () => {
    const response = await request
      .get(`/api/v1/lockers/free/${bloqId}`)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
    if (!response.body.hasOwnProperty("message")) {
      expect(response.body).toMatchObject({
        bloqId,
        status: LockerStatus.OPEN,
        isOccupied: false,
        id: lockerId,
      });
    }
  });

  it("should return 404 on invalid bloqId", async () => {
    const response = await request
      .get("/api/v1/lockers/free/4")
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /rents", () => {
  let connection: typeof mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
    );
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should return 201 on valid request", async () => {
    const response = await request
      .post("/api/v1/rents")
      .send({
        weight: 20,
        size: RentSize.L,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      weight: 20,
      size: RentSize.L,
      lockerId: null,
      status: RentStatus.CREATED,
      droppedOffAt: null,
      pickedUpAt: null,
    });
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("createdAt");
    rentId = response.body.id;
  });

  it("should return 400 on invalid request body", async () => {
    const response = await request
      .post("/api/v1/rents")
      .send({
        weight: 20,
        size: "Z",
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
  });
});

describe("PATCH /rents/:id/reserve", () => {
  let connection: typeof mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
    );
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should return 200 on valid request and update status", async () => {
    const response = await request
      .patch(`/api/v1/rents/${rentId}/reserve`)
      .send({
        lockerId,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      weight: 20,
      size: RentSize.L,
      lockerId,
      status: RentStatus.WAITING_DROPOFF,
      droppedOffAt: null,
      pickedUpAt: null,
      id: rentId,
    });
    expect(response.body).toHaveProperty("createdAt");
  });

  it("should return 404 invalid rentId", async () => {
    const response = await request
      .patch("/api/v1/rents/4/reserve")
      .send({
        lockerId,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(404);
  });

  it("should return 409 on lockerId already occupied", async () => {
    const response = await request
      .patch(`/api/v1/rents/${rentId}/reserve`)
      .send({
        lockerId,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(409);
  });
});

describe("PATCH /rents/:id/status", () => {
  let connection: typeof mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
    );
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should return 200 on setting status to DELIVERED", async () => {
    const response = await request
      .patch(`/api/v1/rents/${rentId}/status`)
      .send({
        status: RentStatus.DELIVERED,
      })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      weight: 20,
      size: RentSize.L,
      lockerId,
      status: RentStatus.DELIVERED,
      id: rentId,
    });
    expect(response.body).toHaveProperty("createdAt");
  });
});
