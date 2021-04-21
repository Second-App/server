const request = require('supertest');
const app = require('../app.js');
const { Product, User, Category } = require('../models')
const { generateToken } = require('../helpers/jwt.js');
const { seederUser } = require('./seeder.js');

let idUser
let CategoryId


describe("TESTING CATEGORIES", () => {
  beforeAll((done) => {
    const body = {
      UserId: idUser,
      TypeId:1,
      CategoryId: 1,
      name: 'baju',
      price: 150000,
      description: " baju baru ",
      imageUrl: 'https://cf.shopee.co.id/file/17360534176f08e8dc2d91320e440cdb',
      location: 'jakarta',
      sold: false,
      available: true,
      condition: 90
    }

    Product.create(body)
    .then(() => {
      return Category.findOne()
    })
    .then(category => {
      CategoryId = category.id
      done()
    })
    .catch(err => {
      done(err)
    })
  });
  afterAll((done) => {
    Product.destroy({ where: {} })
    .then(() => {
      // done()
      return User.destroy({ where: {}})
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  describe("GET TEST CASE", () => {
    describe("SUCCESS TEST CASE", () => {
      it("It should returned with status code 200", (done) => {
        request(app)
        .get('/categories/')
        .send()
        .end((err, res) => {
          if(err) done(err);
          expect(res.statusCode).toEqual(200)
          expect(Array.isArray(res.body)).toEqual(true)
          expect(res.body).toEqual(
            expect.arrayContaining([expect.any(Object)])
          )
          done()
        })
      })
    })
  })

  describe("GET BY ID TEST CASE", () => {
    describe("SUCCESS TEST CASE", () => {
      it("It should returned with status code 200", (done) => {
        request(app)
        .get(`/categories/${CategoryId}`)
        .send()
        .end((err, res) => {
          if(err) done(err);
          expect(res.statusCode).toEqual(200)
          expect(Array.isArray(res.body)).toEqual(true)
          expect(res.body).toEqual(
            expect.arrayContaining([expect.any(Object)])
          )
          done()
        })
      })
    })

    describe("FAILED TEST CASE: id not found", () => {
      it("It should returned with status code 500", (done) => {
        request(app)
        .get(`/categories/${20}`)
        .send()
        .end((err, res) => {
          if(err) done(err);
          expect(res.statusCode).toEqual(500)
          expect(res.body).toHaveProperty('msg', "Internal Server Error")
          
          done()
        })
      })
    })
  })

})