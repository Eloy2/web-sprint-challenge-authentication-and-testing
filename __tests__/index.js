const supertest = require("supertest")
const server = require("../api/server")
const db = require("../database/dbConfig")

afterAll(async () => {
    await db.destroy() // closes database connection after testing is done
})

describe("users integration tests", () => {
    // REGISTER TESTS //////////////////////////////////////////////////////////////

    it("POST / => returns status 201 whne we create a user", async () => {
		const res = await supertest(server)
			.post("/api/auth/register")
            .send({ username: "newgirl", password: "123" }) // CHANGE THE USERNAME EVERYTIME YOU RUN TESTS(ADD PLUS 1 TO THE NUMBER)
        expect(res.statusCode).toBe(201)
    })

    it("POST / => returns newly created user", async () => {
		const res = await supertest(server)
			.post("/api/auth/register")
            .send({ username: "dan6", password: "123" }) // CHANGE THE USERNAME EVERYTIME YOU RUN TESTS(ADD PLUS 1 TO THE NUMBER)
        expect(res.body.username).toBe("dan6")
    })

    // LOGIN TESTS ////////////////////////////////////////////////////////////////////

    it("LOGIN / => returns welcome user", async () => {
		const res = await supertest(server)
			.post("/api/auth/login")
            .send({ username: "newgirl", password: "123" })
        expect(res.body.message).toBe("Welcome newgirl!")
    })

    it("LOGIN / => returns status 200", async () => {
		const res = await supertest(server)
			.post("/api/auth/login")
            .send({ username: "newgirl", password: "123" })
        expect(res.statusCode).toBe(200)
    })

    // GET TESTS ///////////////////////////////////////////////////////////////////////

    it("GET / => returns status 401", async () => {
		const res = await supertest(server)
			.get("/api/jokes")
        expect(res.statusCode).toBe(401)
    })

    it("GET / => returns status 200", async () => {
        const loginRes = await supertest(server)
        .post("/api/auth/login")
        .send({ username: "newgirl", password: "123" })
		const res = await supertest(server)
            .get("/api/jokes")
            .set({ authorization: loginRes.body.token })
        expect(res.statusCode).toBe(200)
    })
})

