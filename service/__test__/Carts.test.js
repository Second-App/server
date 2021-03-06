const request = require('supertest');
const app = require('../app.js');
const { User, Cart, Product } = require('../models')
const { seederUser, seederSecondUser } = require('./seeder.js');
const { generateToken } = require('../helpers/jwt.js');

let access_token;
let idUser
let ProductId
let CartId
let secondUserId
let secondAccess_token

describe("CART TEST CASE", () => {
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
      return Cart.create({UserId: idUser, ProductId})
    })
    .then(() => {
      return Cart.findOne()
      
    }).then((data) => {
      CartId = data.id
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
      secondAccess_token = generateToken(user)
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
      return Cart.destroy({ where: {}})
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  describe('POST new items to cart', () => {
    describe('POST SUCCESS CASE', () => {
      it('It should return with status code 201 and return new data', (done) => {
        const body = {
          ProductId
        };
        
        request(app)
          .post('/carts')
          .send(body)
          .set('access_token', secondAccess_token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(201);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('Product', expect.any(Object));
            done();
          });
      });
    });

    describe('POST FAILED CASE: not sending ProductId', () => {
      it('It should return with status code 500 and return new data', (done) => {
        const body = {
          ProductId
        };
        // console.log(secondAccess_token, access_token, secondUserId, idUser, "<<<<< ini post")
        
        request(app)
          .post('/carts')
          .send()
          .set('access_token', secondAccess_token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('msg', 'Internal Server Error')

            done();
          });
      });
    });

    describe('POST FAILED CASE: product already in cart', () => {
      it('It should return with status code 404 and return new data', (done) => {
        const body = {
          ProductId
        };
        
        request(app)
          .post('/carts')
          .send(body)
          .set('access_token', secondAccess_token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('msg', 'Item already in cart')

            done();
          });
      });
    });

    describe('POST FAILED CASE: product id undefined value', () => {
      it('It should return with status code 404 and return new data', (done) => {
        const body = {
          ProductId: 'failed'
        };
        
        request(app)
          .post('/carts')
          .send(body)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('msg', 'Internal Server Error')

            done();
          });
      });
    });

    describe('POST FAILED CASE: not sending access token', () => {
      it('It should return with status code 404 and return new data', (done) => {
        const body = {
          ProductId
        };
        
        request(app)
          .post('/carts')
          .send(body)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('msg', 'invalid token')

            done();
          });
      });
    });

  });
  
  describe('GET carts', () => {
    describe('GET SUCCESS CASE', () => {
      it("It should returned with status code 200", (done) => {
        
        request(app)
        .get('/carts/')
        .send()
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).toEqual(200)
          expect(typeof res.body).toEqual('object')
          expect(Array.isArray(res.body)).toEqual(true)
          expect(res.body).toEqual(
            expect.arrayContaining([expect.any(Object)])
          )
    
          done()
        })
      })
    })

    describe('GET FAILED CASE: not sending access token', () => {
      it("It should returned with status code 401", (done) => {
        
        request(app)
        .get('/carts/')
        .send()
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).toEqual(401)
          expect(res.body).toHaveProperty('msg', 'invalid token')

          done()
        })
      })
    })

    describe('GET FAILED CASE: empty carts', () => {
      beforeAll((done) => {
        Cart.destroy({ where: {UserId: secondUserId}})
        .then(() => {
          done()
        })
        .catch((err) => {
          done(err)
        })
      })
      it("It should returned with status code 500", (done) => {
        
        request(app)
        .get('/carts/')
        .send()
        .set('access_token', secondAccess_token)
        .end((err, res) => {
          if (err) done(err)
          expect(res.statusCode).toEqual(500)
          expect(res.body).toHaveProperty('msg', 'Internal Server Error')

          done()
        })
      })
    })

  })
  
  describe('DELETE CASE: delete cart', () => {
    
    describe('DELETE SUCCESS CASE', () => {
      it('Should return with status code 200', (done) => {
        request(app)
        .delete(`/carts/${CartId}`)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('msg', 'Cart deleted');
          done();
        });
      });
    });

    describe('DELETE FAILED CASE: Cart id not found', () => {
      it('Should return with status code 404', (done) => {
        request(app)
        .delete(`/carts/1000`)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(404);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('msg', 'Id not found');
          done();
        });
      });
    });
    

    describe('DELETE FAILED CASE: dont have access token/access token invalid', () => {
      it('Should return with status code 401', (done) => {
        request(app)
        .delete(`/carts/${CartId}`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('msg', 'invalid token');
          done();
        });
      });
    });

    describe('DELETE FAILED CASE: dont have access token/access token invalid', () => {
      it('Should return with status code 401', (done) => {
        request(app)
        .delete(`/carts/${CartId}`)
        .set('access_token', 'bukantokennya')
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('msg', 'invalid token');
          done();
        });
      });
    });
  })
  
})

