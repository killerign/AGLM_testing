
const app = require("../app"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require('mongoose');
const time = require('../time');
const sinon = require('sinon');
sinon.stub(time, 'setTimeout');

const databaseName = "test";

beforeAll(async () => {
  const url = "mongodb+srv://AGLM:cseb@aglm.kqx5g.mongodb.net/AGLM-DB?retryWrites=true&w=majority";
  await mongoose.connect(url, { useNewUrlParser: true });
});
it("Testing",async() => {
	expect(1).toBe(1);
	jest.useFakeTimers();
});
//future lecture
it("returns only future lecture", async done => {
	const response = await request.get("/nextlectures");
	expect(response.status).toBe(200);
	jest.useFakeTimers();
	done();
  });
//valid user
  it("should return type",async done => {
	const res = await request.post("/").send({
		uid : "cO77kwy785eXoSeoVgXgr81T3cq1"
	});
	expect(res.status).toBe(200);
	expect(res.body.type).toBe('user');
	done();
});

//invalid user
it("should return not found",async done => {
	const res = await request.post("/").send({
		uid : "nullerpointer"
	});
	expect(res.status).toBe(400);
	done();
});

//

afterAll(() => { 
	mongoose.connection.close()
  })