const request = require("supertest");
const app = require("../app.js");
const { generateToken } = require("../helpers/jwt");

describe("testing /whistlists", () => {
  let access_token;
  let id;

  beforeAll(() => {
    access_token = generateToken({
      id: 1,
      email: "User@mail.com",
    });
  });

  // POST Berhasil
  describe("success POST request", () => {
    it("It should return status 201 and newly created whistlist data", (done) => {
      const body = {
        UserId: 1,
        CategoryId: 1,
      };
      request(app)
        .post("/whistlists")
        .send(body)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).toEqual(201);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("UserId", body.UserId);
          expect(res.body).toHaveProperty("ProductId", body.ProductId);

          expect(typeof res.body.id).toEqual("number");
          expect(typeof res.body.UserId).toEqual("number");
          expect(typeof res.body.ProductId).toEqual("number");

          done();
        });
    });
  });

  // POST Gagal
  describe("Failed POST request", () => {
    it("Should return response with status code 401, dont have access_token", (done) => {
      const body = {
        UserId: null,
        CategoryId: null,
      };
      request(app)
        .post("/whistlists")
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message", "Invalid Token");

          done();
        });
    });
  });

  // GET Berhasil
  describe("success GET request", () => {
    it("It should return status 200 and get whistlist data", (done) => {
      request(app)
        .get("/whistlists")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("UserId", body.UserId);
          expect(res.body).toHaveProperty("ProductId", body.ProductId);
          expect(res.body).toHaveProperty("Products", expect.any(Array));
          expect(res.body).toHaveProperty("Users", expect.any(Array));

          expect(typeof res.body.id).toEqual("number");
          expect(typeof res.body.UserId).toEqual("number");
          expect(typeof res.body.ProductId).toEqual("number");

          done();
        });
    });
  });

  // DELETE Berhasil
  describe("success DELETE request", () => {
    it("It should return status 200 and delete whistlist data", (done) => {
      request(app)
        .delete(`/whistlists/${WhistlistId}`)
        .set("access_token", access_token)

        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message", "Whistlist deleted");

          done();
        });
    });
  });

  // DELETE Gagal
  describe("Failed DELETE request", () => {
    it("should return response with status code 401, dont have access_token", (done) => {
      request(app)
        .delete(`/whistlists/${WhistlistId}`)
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message", "Invalid Token");

          done();
        });
    });
  });
});
