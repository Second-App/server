const request = require('supertest');
const app = require('../app.js');
const { generateToken } = require('../helpers/jwt.js');

describe('testing /products', () => {
  let access_token;
  let id;

  beforeAll(() => {
    access_token = generateToken({
      id: 1,
      email: 'User@mail.com',
    });
  });

  describe("POST product case", () => {
    // POST berhasil
    describe('SUCCESS CASE POST request', () => {
      it('It should return status 201 and newly created product data', (done) => {
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
          .post('/products')
          .send(body)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) {
              done(err);
            }
  
            expect(res.status).toEqual(201);
            expect(typeof res.body).toEqual('object');
  
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('UserId', body.UserId);
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
            expect(typeof res.body.UserId).toEqual('number');
            expect(typeof res.body.TypeId).toEqual('number');
            expect(typeof res.body.CategoryId).toEqual('number');
            expect(typeof res.body.name).toEqual('string');
            expect(typeof res.body.price).toEqual('number');
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
              'Input name should not be empty',
              'Input price should not be empty',
              'Input description should not be empty',
              'Input imageUrl should not be empty',
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
        .post('/products')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input name should not be empty');

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
        .post('/products')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input name should not be empty');

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

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input description should not be empty');

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

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input imageUrl should not be empty');

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

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input location should not be empty');

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
          expect(res.body).toHaveProperty('data', expect.any(Object))
          expect(Array.isArray(res.body.data)).toEqual(true)
          expect(res.body.data).toEqual(
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
          expect(res.body).toHaveProperty('data', expect.any(Object))
          expect(res.body.data).toHaveProperty('id', expect.any(Number))
          expect(res.body.data).toHaveProperty('name', expect.any(String))
          expect(res.body.data).toHaveProperty('price', expect.any(Number))
          expect(res.body.data).toHaveProperty('description', expect.any(String))
          expect(res.body.data).toHaveProperty('imageUrl', expect.any(String))
          expect(res.body.data).toHaveProperty('location', expect.any(String))
          expect(res.body.data).toHaveProperty('sold', expect.any(Boolean))
          expect(res.body.data).toHaveProperty('available', expect.any(Boolean))
          done()
        }
      })
    })
  })

  describe("PUT product case", () => {
    // POST berhasil
    describe('SUCCESS CASE PUT request', () => {
      it('It should return status 201 and newly updated product data', (done) => {
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
  
            expect(res.status).toEqual(201);
            expect(typeof res.body).toEqual('object');
  
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('UserId', body.UserId);
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
            expect(typeof res.body.UserId).toEqual('number');
            expect(typeof res.body.TypeId).toEqual('number');
            expect(typeof res.body.CategoryId).toEqual('number');
            expect(typeof res.body.name).toEqual('string');
            expect(typeof res.body.price).toEqual('number');
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
              'Input imageUrl should not be empty',
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

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input name should not be empty');

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

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input name should not be empty');

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

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input description should not be empty');

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

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input imageUrl should not be empty');

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

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input location should not be empty');

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
          expect(re.body).toHaveProperty('message');
          expect(res.body.message).toEqual('Product deleted');
          done();
        });
      })
    })

    describe("FAILED CASE: wrong access token", () => {
      it('It should return with status code 404', (done) => {
        request(app)
          .delete(`/products/${ProductId}`)
          .set('access_token', 'bukantokennya')
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(404);
            done();
          });
      });
    })

    describe("FAILED CASE: not including access token", () => {
      it('It should return with status code 404', (done) => {
        request(app)
          .delete(`/products/${ProductId}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(404);
            done();
          });
      });
    })
  })

});
