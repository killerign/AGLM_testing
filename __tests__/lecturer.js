const app = require("../app"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require('mongoose');
const time = require('../time');
const sinon = require('sinon');
sinon.stub(time, 'setTimeout');
jest.setTimeout(50000);

beforeAll(async () => {
  const url = "mongodb+srv://AGLM:cseb@aglm.kqx5g.mongodb.net/AGLM-DB?retryWrites=true&w=majority";
  await mongoose.connect(url, { useNewUrlParser: true });
});

describe("Check if lecturer collection returns", ()=> {
	let id = "2"
	test("If lecturer is returned ", async(done) => {
		const res = await request.post("/getLecturer").send({
			id : id
		});
		expect(res.status).toBe(200);
		done();
	});
    test("If past lectures are returned", async(done) => {
		const res = await request.post("/pastLectures").send({
			id : id
		});
		expect(res.status).toBe(200);
		expect(res.body.length).toBeGreaterThanOrEqual(1);
		done();
	});
  });

  
  describe("Lecturer creation", ()=> {
    var obj = {"name":"Jamie swan",
                "degree":"B.Tech",
                "bio":"Swan",
                "gmail":"jj@google.us.com",
                "linkedin":"JJ_human",
                "achievements":["Published 100+ papers","Won 200+ Hackathons","National representative of ACM",
                "Founder of Electric Dipole Organization"],
                "lectures":[],
                "profile":"https://essa-africa.org/sites/default/files/2019-11/Aishwarya%20Tiku.jpg"}
    test("If creation returns sucess", async(done) => {
		const res = await request.post("/createlecturer").send(
			obj
		);
		expect(res.status).toBe(200);
		done();
	});
    test("If lecturer present in the list", async(done) => {
		const res = await request.get("/lecturerList").send({
		});
		expect(res.status).toBe(200);
        var char = false
        for (let i = 0; i < res.body.length; i++) {
            if(res.body[i]['name']=='Jamie swan')
            {
                char = true;
            }    
        }
        expect(char).toBeTruthy();
		done();
	});
    test("Delete created lecture", async(done) => {
		const res = await request.post("/destroylecture").send({
			name : obj.name
		});
		expect(res.status).toBe(200);
		done();
	});
  });
  

  it("Check type of user",async done => {
	const res = await request.post("/getParticipants").send({
		id : "1"
	});
	expect(res.status).toBe(200);
	expect(res.body.length).toBeGreaterThanOrEqual(0);
	done();
});

describe("Check if file is added to repository", ()=> {
	let id = "1";
    let url = "https://drive.google.com/file/d/13BsK9i0qvOpN545lNL11EJQVsmja17m4/view?usp=sharing";
    let type = "JPG";
	test("If image added returns success", async(done) => {
		const res = await request.post("/addFile").send({
			lecture_id : id,
            url : url,
            type: type
		});
		expect(res.status).toBe(200);
		done();
	});
    test("If image present in lecture", async(done) => {
		const res = await request.get("/completedlectures").send({
		});
		expect(res.status).toBe(200);
        var char = false
        for (let i = 0; i < res.body.length; i++) {
            if(res.body[i]['lecture_id'] == id)
            {   
                for(let j = 0; j<res.body[i]['repository'][0].length;j++)
                {
                    if(res.body[i]['repository'][0][j] == url)
                    {
                        char = true
                    }
                }
            }    
        }
        expect(char).toBeTruthy();
		done();
	});
    test("Delete added image", async(done) => {
		const res = await request.post("/destroyfile").send({
			lecture_id : id,
            url : url
		});
		expect(res.status).toBe(200);
		done();
	});
  });
  


  afterAll(() => { 
	mongoose.connection.close()
  });
