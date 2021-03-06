const request = require('supertest');
const app = require('../app.js');
const { Product, User } = require('../models')
const { generateToken } = require('../helpers/jwt.js');
const { seederUser } = require('./seeder.js');

let access_token;
let ProductId;
let idUser

describe('testing /products', () => {
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
        name: 'baju',
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


  describe("POST product case", () => {
    // POST berhasil
    describe('SUCCESS CASE POST request', () => {
      it('It should return status 201 and newly created product data', (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: "500000",
          description: 'sepatu bekas',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: 'jakarta',
          condition: 90
        };
        request(app)
          .post('/products/')
          .send(body)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) {
              done(err);
            }

            expect(res.status).toEqual(201);
            expect(typeof res.body).toEqual('object');
  
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('TypeId', body.TypeId);
            expect(res.body).toHaveProperty('CategoryId', body.CategoryId);
            expect(res.body).toHaveProperty('name', body.name);
            expect(res.body).toHaveProperty('price', body.price);
            expect(res.body).toHaveProperty('description', body.description);
            expect(res.body).toHaveProperty('imageUrl', body.imageUrl);
            expect(res.body).toHaveProperty('location', body.location);
            expect(res.body).toHaveProperty('sold', false);
            expect(res.body).toHaveProperty('available', true);
  
            expect(typeof res.body.id).toEqual('number');
            expect(typeof res.body.TypeId).toEqual('number');
            expect(typeof res.body.CategoryId).toEqual('number');
            expect(typeof res.body.name).toEqual('string');
            expect(typeof res.body.price).toEqual('string');
            expect(typeof res.body.description).toEqual('string');
            expect(typeof res.body.imageUrl).toEqual('string');
            expect(typeof res.body.location).toEqual('string');
            expect(typeof res.body.sold).toEqual('boolean');
            expect(typeof res.body.available).toEqual('boolean');

            done()
          });
      });
    });

    describe("FAILED CASE: all field empty", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: '',
          price: 0 || '',
          description: '',
          imageUrl: '',
          location: '',
          sold: false,
          available: true
        };
        request(app)
        .post('/products')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(Array.isArray(res.body.msg)).toEqual(true);
          expect(res.body.msg).toEqual(
            expect.arrayContaining([
              "Input name should not be empty",
              "Input price should not be empty",
              "Input price should be a number integer value",
              "Input imageUrl should not be empty",
              "Invalid input Url",
              "Input location should not be empty"
            ])
          );

          done();
        });
      })
    })

    describe("FAILED CASE: empty name", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: '',
          price: 500000,
          description: 'sepatu bekas',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: 'jakarta',
          sold: false,
          available: true
        };
        request(app)
        .post('/products')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');
          expect(Array.isArray(res.body.msg)).toEqual(true)
          expect(res.body.msg).toEqual(
            expect.arrayContaining(["Input name should not be empty"])
          )

          done();
        });
      })
    })

    describe("FAILED CASE: empty price or price inputed as string", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          UserId: 1,
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: 0 || '',
          description: 'sepatu bekas',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: 'jakarta',
          sold: false,
          available: true
        };
        request(app)
        .post('/products')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');
          expect(Array.isArray(res.body.msg)).toEqual(true)
          expect(res.body.msg).toEqual(
            expect.arrayContaining(["Input price should not be empty"])
          )

          done();
        });
      })
    })

    describe("FAILED CASE: empty description", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: 500000,
          description: '',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: 'jakarta',
          sold: false,
          available: true
        };
        request(app)
        .post('/products')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');
          
          expect(res.body).toHaveProperty('msg');
          expect(Array.isArray(res.body.msg)).toEqual(true)
          expect(res.body.msg).toEqual(
            expect.arrayContaining(["Input description should not be empty"])
          )

          done();
        });
      })
    })

    describe("FAILED CASE: empty imageUrl", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: 500000,
          description: 'septu bekas',
          imageUrl: '',
          location: 'jakarta',
          sold: false,
          available: true
        };
        request(app)
        .post('/products')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');
          expect(Array.isArray(res.body.msg)).toEqual(true)
          expect(res.body.msg).toEqual(
            expect.arrayContaining(["Input imageUrl should not be empty"])
          )

          done();
        });
      })
    })

    describe("FAILED CASE: empty location", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: 500000,
          description: 'septu bekas',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: '',
          sold: false,
          available: true
        };
        request(app)
        .post('/products')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');
          expect(Array.isArray(res.body.msg)).toEqual(true)
          expect(res.body.msg).toEqual(
            expect.arrayContaining(["Input location should not be empty"])
          )

          done();
        });
      })
    })

  })

  describe("GET all products", () => {
    describe("SUCCESS CASE", () => {
      it("It should returned with status code 200 and returned object", (done) => {
        request(app)
        .get('/products/')
        .send()
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);
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

  describe("GET products by id /products/:id", () => {
    it("should return with status code 200 and returned object", (done) => {
      request(app)
      .get(`/products/${ProductId}`)
      .send()
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          expect(res.statusCode).toEqual(200)
          expect(typeof res.body).toEqual('object')
          // expect(res.body).toHaveProperty('data')
          expect(res.body).toHaveProperty('id', expect.any(Number))
          expect(res.body).toHaveProperty('name', expect.any(String))
          expect(res.body).toHaveProperty('price', expect.any(String))
          expect(res.body).toHaveProperty('description', expect.any(String))
          expect(res.body).toHaveProperty('imageUrl', expect.any(String))
          expect(res.body).toHaveProperty('location', expect.any(String))
          expect(res.body).toHaveProperty('sold', expect.any(Boolean))
          expect(res.body).toHaveProperty('available', expect.any(Boolean))
          expect(res.body).toHaveProperty('condition', expect.any(Number))
          // expect(res.body.data).toHaveProperty('Type', expect.any(Object))
          // expect(res.body.data).toHaveProperty('Category', expect.any(Object))
          done()
        }
      })
    })
  })

  describe("PUT product case", () => {
    // POST berhasil
    describe('SUCCESS CASE PUT request', () => {
      it('It should return status 200 and newly updated product data', (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: 500000,
          description: 'sepatu bekas',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: 'jakarta',
        };
        request(app)
          .put(`/products/${ProductId}`)
          .send(body)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            
            expect(res.status).toEqual(200);
            expect(typeof res.body).toEqual('object');
  
            expect(res.body).toHaveProperty('msg', 'data updated');
            

            done()
          });
      });
    });

    describe("FAILED CASE: all field empty", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: '',
          price: 0 || '',
          description: '',
          imageUrl: '',
          location: '',
          sold: false,
          available: true
        };
        request(app)
        .put(`/products/${ProductId}`)
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(Array.isArray(res.body.msg)).toEqual(true);
          expect(res.body.msg).toEqual(
            expect.arrayContaining([
              'Input name should not be empty',
              'Input price should not be empty',
              'Input description should not be empty',
              // 'Input imageUrl should not be empty',
              'Input location should not be empty'
            ])
          );

          done();
        });
      })
    })

    describe("FAILED CASE: empty name", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: '',
          price: 500000,
          description: 'sepatu bekas',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: 'jakarta',
          sold: false,
          available: true
        };
        request(app)
        .put(`/products/${ProductId}`)
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(Array.isArray(res.body.msg)).toEqual(true);
          expect(res.body.msg).toEqual(
            expect.arrayContaining([
              'Input name should not be empty'
            ])
          );

          done();
        });
      })
    })

    describe("FAILED CASE: empty price or price inputed as string", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: 0 || '',
          description: 'sepatu bekas',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: 'jakarta',
          sold: false,
          available: true
        };
        request(app)
        .put(`/products/${ProductId}`)
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(Array.isArray(res.body.msg)).toEqual(true);
          expect(res.body.msg).toEqual(
            expect.arrayContaining([
              'Input price should not be empty'
            ])
          );

          done();
        });
      })
    })

    describe("FAILED CASE: empty description", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: 500000,
          description: '',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: 'jakarta',
          sold: false,
          available: true
        };
        request(app)
        .put(`/products/${ProductId}`)
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(Array.isArray(res.body.msg)).toEqual(true);
          expect(res.body.msg).toEqual(
            expect.arrayContaining([
              'Input description should not be empty'
            ])
          );

          done();
        });
      })
    })

    describe("FAILED CASE: empty imageUrl", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: 500000,
          description: 'septu bekas',
          imageUrl: '',
          location: 'jakarta',
          sold: false,
          available: true
        };
        request(app)
        .put(`/products/${ProductId}`)
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(Array.isArray(res.body.msg)).toEqual(true);
          expect(res.body.msg).toEqual(
            expect.arrayContaining([
              'Input imageUrl should not be empty'
            ])
          );

          done();
        });
      })
    })

    describe("FAILED CASE: empty location", () => {
      it("It should return with status code 400", (done) => {
        const body = {
          TypeId: 1,
          CategoryId: 1,
          name: 'sepatu',
          price: 500000,
          description: 'septu bekas',
          imageUrl:
            'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1578674395-vans-men-s-low-top-sneakers-1578674390.jpg',
          location: '',
          sold: false,
          available: true
        };
        request(app)
        .put(`/products/${ProductId}`)
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(Array.isArray(res.body.msg)).toEqual(true);
          expect(res.body.msg).toEqual(
            expect.arrayContaining([
              'Input location should not be empty'
            ])
          );

          done();
        });
      })
    })
    
  })
  
  describe("DELETE product case", () => {
    describe("SUCCESS CASE", () => {
      it("It should returned with status code 200", (done) => {
        request(app)
        .delete(`/products/${ProductId}`)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('msg', 'Product deleted');
          done();
        });
      })
    })

    describe("FAILED CASE: wrong access token", () => {
      it('It should return with status code 401', (done) => {
        request(app)
          .delete(`/products/${ProductId}`)
          .set('access_token', 'bukantokennya')
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(401);
            done();
          });
      });
    })

    describe("FAILED CASE: not including access token", () => {
      it('It should return with status code 40', (done) => {
        request(app)
          .delete(`/products/${ProductId}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(401);
            done();
          });
      });
    })
  })

});
