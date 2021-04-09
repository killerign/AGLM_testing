
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
	expect(response.body.length).not.toBe(0);
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

  describe("Applying for approval", ()=> {
	let id = "coronavester";
	let email = "corona2009@gmail.com"
	test("Check if new entry in approval collection", async(done) => {
		const res = await request.post("/requestlogin").send({
			uid : id,
			email: email
		});
		expect(res.status).toBe(200);
		expect(res.body.status).toBe("Success");
		done();
	});
  });

  describe("Removing after approval", ()=> {
	let id = "coronavester";
	let email = "corona2009@gmail.com"
	test("Check if uid in database, delete and move it to login collection", async(done) => {
		const res = await request.post("/deletelogin").send({
			uid : id,
			email: email
		});
		expect(res.status).toBe(200);
		expect(res.body.status).toBe("Success");
		done();
	});
  });

describe("Login entry creation", () => {
	let id = "coronavester";
	test("check if credentials added to login", async(done) => {
		const res = await request.post("/").send({
			uid : id
	});
	expect(res.status).toBe(200);
	done();
	});
  });

  describe("Registration checker", () => {
	let id = "coronavester";
	let lecture = '7';
	test("check if uid can be registered", async(done) => {
		const res = await request.post("/register").send({
			uid : id,
			lecture_id : lecture
	});
	expect(res.status).toBe(200);
	done();
	});
  });

  describe("Registration remover", () => {
	let id = "coronavester";
	let lecture = '7';
	test("Check if uid is registered and remove it", async(done) => {
		const res = await request.post("/remove").send({
			uid : id,
			lecture_id : lecture 
	});
	expect(res.status).toBe(200);
	done();
	});
  });

afterAll(() => { 
	mongoose.connection.close()
  });
