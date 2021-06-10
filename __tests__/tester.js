
const app = require("../app"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require('mongoose');
const time = require('../time');
const sinon = require('sinon');
sinon.stub(time, 'setTimeout');
jest.setTimeout(30000);

beforeAll(async () => {
  const url = "mongodb+srv://AGLM:cseb@aglm.kqx5g.mongodb.net/AGLM-DB?retryWrites=true&w=majority";
  await mongoose.connect(url, { useNewUrlParser: true });
});

//future lecture
it("Check if future lectures are returned", async done => {
	const response = await request.get("/nextlectures");
	expect(response.status).toBe(200);
	expect(response.body.length).toBeGreaterThanOrEqual(0);
	jest.useFakeTimers();
	done();
  });
//valid user
  it("Check type of user",async done => {
	const res = await request.post("/").send({
		uid : "cO77kwy785eXoSeoVgXgr81T3cq1"
	});
	expect(res.status).toBe(200);
	expect(res.body.type).toBe('user');
	done();
});

//invalid user
it("Check if user not found",async done => {
	const res = await request.post("/").send({
		uid : "nullerpointer"
	});
	expect(res.status).toBe(400);
	jest.useFakeTimers();
	done();
});

//pastlectures
describe("All past lectures", () => {
test("Checks if past lectures are returned", async(done) => {
	const response = await request.get("/completedlectures");
	expect(response.status).toBe(200);
	expect(response.body.length).not.toBe(0);
	jest.useFakeTimers();
	done();
  });
});

  describe("My past lectures", () => {
	  let id = "cO77kwy785eXoSeoVgXgr81T3cq1";
	test("Check if my past lectures are returned",async(done)=>{
		const res= await request.post("/mylectures_pre").send({
			uid:id
			});
			expect(res.status).toBe(200);
			expect(res.body.length).not.toBe(0);
			done();
	});
  });

  describe("Count tester", () => {
	let id = "cO77kwy785eXoSeoVgXgr81T3cq1";
	test("Check if output is proper", async(done) => {
		const res = await request.post("/countlectures").send({
			uid: id
		});
		expect(res.status).toBe(200);
		expect(res.body['future']).toBeGreaterThanOrEqual(0);
		expect(res.body['present']).toBeGreaterThanOrEqual(0);
		expect(res.body['my']).toBeGreaterThanOrEqual(0);
		done();
	});
  });

afterAll(() => { 
	mongoose.connection.close()
  });
