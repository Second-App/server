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

  // POST berhasil
  describe('success POST request', () => {
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
          expect(res.body).toHaveProperty('UserId');
          expect(res.body).toHaveProperty('TypeId');
          expect(res.body).toHaveProperty('CategoryId');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('price');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('imageUrl');
          expect(res.body).toHaveProperty('location');
          expect(res.body).toHaveProperty('sold');
          expect(res.body).toHaveProperty('available');

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
        });
    });
  });
});
