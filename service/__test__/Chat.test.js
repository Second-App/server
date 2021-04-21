const request = require("supertest");
const app = require("../app.js");
const { generateToken } = require("../helpers/jwt");
const { User, Chat, Product } = require('../models')
const { seederUser, seederSecondUser } = require('./seeder.js');

let access_token
let SenderId
let ReceiverId
let message = "hello"
let ChatId


let secondUserAccess_token

describe("testing /chats", () => {
  beforeAll((done) => {
    seederUser()
    .then(() => {
      return User.findOne()
    })
    .then(data => {
      const user = {
        id: data.id,
        email: data.email
      }
      SenderId = user.id
      access_token = generateToken(user)

      return seederSecondUser()
    })
    .then(() => {
      return User.findAll()
    })
    .then(users => {
      const user = {
        id: users[1].id,
        email: users[1].email
      }
      ReceiverId = users[1].id,
      secondUserAccess_token = generateToken(user)
      return Chat.create({
        SenderId,
        ReceiverId,
        message
      })
    })
    .then(() => {
      return Chat.findOne()
    }).then((data) => {
      ChatId = data.id
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  afterAll((done) => {
    User.destroy({ where: {}})
    .then(() => {
      return Chat.destroy({ where: {}})
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  // POST Berhasil
  describe("success POST request", () => {
    it("It should return status 201 and newly created chats data", (done) => {
      const body = {
        SenderId,
        ReceiverId,
        message
      };
      request(app)
        .post("/chats/")
        .send(body)
        .set("access_token", secondUserAccess_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          
          expect(res.status).toEqual(201);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("SenderId");
          expect(res.body).toHaveProperty("ReceiverId");
          expect(res.body).toHaveProperty("message");

          expect(typeof res.body.SenderId).toEqual("number");
          expect(typeof res.body.ReceiverId).toEqual("number");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });
  });

  // POST Gagal
  describe("Failed POST request", () => {
    it("Should return response with status code 401, dont have access_token", (done) => {
      const body = {
        UserId: null,
        ProductId: null,
      };
      request(app)
        .post("/chats")
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("msg", "invalid token");

          done();
        });
    });
  });

  // GET Berhasil
  describe("success GET request", () => {
    it("It should return status 200 and get chats data", (done) => {
      request(app)
        .get("/chats")
        .set("access_token", secondUserAccess_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(typeof res.body.send).toEqual("object");
          expect(typeof res.body.receive).toEqual("object");
          expect(res.body).toHaveProperty("send")
          expect(res.body).toHaveProperty("receive")

          done();
        });
    });
  });

  describe("success GET request", () => {
    it("It should return status 200 and get chats data", (done) => {
      request(app)
        .get("/chats?targetId=" + (ReceiverId + 1))
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(typeof res.body.send).toEqual("object");
          expect(typeof res.body.receive).toEqual("object");
          expect(res.body).toHaveProperty("send")
          expect(res.body).toHaveProperty("receive")

          done();
        });
    });
  });

  // POST FAIL, NO RECEIVER ID
  describe("fail POST request", () => {
    it("should return response with status code 404, not found", (done) => {
      request(app)
        .post("/chats?targetId=" + (ReceiverId + 10))
        .send({
          message: ""
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("msg")

          done();
        });
    });
  });

  // DELETE Gagal
  describe("Failed DELETE request", () => {
    it("should return response with status code 401, dont have access_token", (done) => {
      request(app)
        .delete(`/chats/${ChatId}`)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("msg", "invalid token");

          done();
        });
    });
  });
});
