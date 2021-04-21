const request = require('supertest');
const app = require('../app.js');
const { Product, User, Community } = require('../models')
const { generateToken } = require('../helpers/jwt.js');
const { seederUser, seederSecondUser } = require('./seeder.js');

let access_token;
let ProductId;
let idUser

let CommunityId

describe("testing /community", () => {
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
      idUser = user.id
      access_token = generateToken(user)

      const body = {
        UserId: idUser,
        TypeId:3,
        CategoryId: 1,
        name: 'bajubaru',
        price: 150000,
        description: " baju baru ",
        imageUrl: 'https://cf.shopee.co.id/file/17360534176f08e8dc2d91320e440cdb',
        location: 'jakarta',
        sold: false,
        available: true,
        condition: 90
      }

      return Product.create(body)
    })
    .then(() => {
      return Product.findOne()
    })
    .then(product => {
      ProductId = product.id
      return Community.create({UserId: idUser, ProductId})
    })
    .then(() => {
      return Community.findOne()
      
    }).then((data) => {
      CommunityId = data.id
      return seederSecondUser()
    })
    .then(() => {
      return User.findAll()
    })
    .then((users) => {
      const user = {
        id: users[1].id,
        email: users[1].email
      }
      secondUserId = users[1].id,
      secondUserAccess_token = generateToken(user)
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  afterAll((done) => {
    User.destroy({ where: {}})
    .then(() => {
      return Product.destroy({ where: {}})
    })
    .then(() => {
      return Community.destroy({ where: {}})
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
    it("It should return status 201 and newly created community data", (done) => {
      const body = {
        ProductId,
      };
      request(app)
        .post("/community/")
        .send(body)
        .set("access_token", secondUserAccess_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          
          expect(res.status).toEqual(201);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("UserId");
          expect(res.body).toHaveProperty("ProductId", body.ProductId);

          expect(typeof res.body.id).toEqual("number");
          expect(typeof res.body.UserId).toEqual("number");
          expect(typeof res.body.ProductId).toEqual("number");

          done();
        });
    });
  });

  // POST Fail Already requested
  describe("fail POST request", () => {
    it("Should return response with status code 400, already in cart", (done) => {
      const body = {
        ProductId,
      };
      request(app)
        .post("/community/")
        .send(body)
        .set("access_token", secondUserAccess_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          
          expect(res.status).toEqual(404);
          expect(typeof res.body).toEqual("object");

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
        .post("/wishlists")
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
    it("It should return status 200 and get community data", (done) => {
      request(app)
        .get("/community")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(Array.isArray(res.body)).toEqual(true)
          expect(res.body).toEqual(
            expect.arrayContaining([expect.any(Object)])
          )

          done();
        });
    });
  });

  // DELETE Berhasil
  describe("success DELETE request", () => {
    it("It should return status 200 and delete community data", (done) => {
      request(app)
        .delete(`/community/${CommunityId}`)
        .set("access_token", access_token)

        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("msg", "Community deleted");

          done();
        });
    });
  });

  // DELETE Fail Unauthorized
  describe("success DELETE request", () => {
    it("It should return status 401 Unauthorized", (done) => {
      request(app)
        .delete(`/community/${CommunityId + 1}`)
        .set("access_token", access_token)

        .end((err, res) => {
          if (err) {
            done(err);
          }
          console.log(res.body)
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("msg");

          done();
        });
    });
  });

  // DELETE Gagal
  describe("Failed DELETE request", () => {
    it("should return response with status code 401, dont have access_token", (done) => {
      request(app)
        .delete(`/community/${CommunityId}`)
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
