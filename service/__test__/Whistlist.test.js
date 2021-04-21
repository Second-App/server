const request = require("supertest");
const app = require("../app.js");
const { generateToken } = require("../helpers/jwt");
const { User, Wishlist, Product } = require('../models')
const { seederUser, seederSecondUser } = require('./seeder.js');

let access_token;
let idUser
let ProductId
let WishlistId

let secondUserId
let secondUserAccess_token

describe("testing /wishlists", () => {
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
        TypeId:1,
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
      return Wishlist.create({UserId: idUser, ProductId})
    })
    .then(() => {
      return Wishlist.findOne()
      
    }).then((data) => {
      WishlistId = data.id
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
      return Wishlist.destroy({ where: {}})
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
    it("It should return status 201 and newly created whistlist data", (done) => {
      const body = {
        ProductId,
      };
      request(app)
        .post("/wishlists/")
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
    it("It should return status 200 and get whistlist data", (done) => {
      request(app)
        .get("/wishlists")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).toEqual(200);
          // expect(typeof res.body).toEqual("object");
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
    it("It should return status 200 and delete whistlist data", (done) => {
      request(app)
        .delete(`/wishlists/${WishlistId}`)
        .set("access_token", access_token)

        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("msg", "Wishlist deleted");

          done();
        });
    });
  });

  // DELETE Gagal
  describe("Failed DELETE request", () => {
    it("should return response with status code 401, dont have access_token", (done) => {
      request(app)
        .delete(`/wishlists/${WishlistId}`)
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
