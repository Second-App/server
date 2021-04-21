const request = require('supertest');
const app = require('../app.js');
const { Type } = require('../models');

describe('testing /types', () => {
  describe('GET /types', () => {
    it('It should return status 200 and array of types data', (done) => {
      request(app)
        .get('/types')
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(200);
          expect(Array.isArray(res.body)).toEqual(true);

          res.body.map((type) => {
            expect(type).toHaveProperty('id');
            expect(type).toHaveProperty('name');
            expect(type).toHaveProperty('createdAt');
            expect(type).toHaveProperty('updatedAt');

            expect(typeof type.id).toEqual('number');
            expect(typeof type.name).toEqual('string');
            expect(typeof type.createdAt).toEqual('string');
            expect(typeof type.updatedAt).toEqual('string');
          });

          done();
        });
    });
  });

  describe('GET /types', () => {
    it('It should return status 200 and array of types data', (done) => {
      request(app)
        .get('/types/1')
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(200);
          expect(Array.isArray(res.body)).toEqual(true);

          res.body.map((type) => {
            expect(type).toHaveProperty('id');
            expect(type).toHaveProperty('UserId');
            expect(type).toHaveProperty('TypeId');
            expect(type).toHaveProperty('CategoryId');
            expect(type).toHaveProperty('name');
            expect(type).toHaveProperty('price');
            expect(type).toHaveProperty('description');
            expect(type).toHaveProperty('imageUrl');
            expect(type).toHaveProperty('location');
            expect(type).toHaveProperty('sold');
            expect(type).toHaveProperty('available');
            expect(type).toHaveProperty('condition');
            expect(type).toHaveProperty('startPrice');
            expect(type).toHaveProperty('currentBid');
            expect(type).toHaveProperty('currentUserBidName');
            expect(type).toHaveProperty('currentUserBidId');
            expect(type).toHaveProperty('createdAt');
            expect(type).toHaveProperty('updatedAt');
            expect(type).toHaveProperty('User');
            expect(type).toHaveProperty('Type');
            expect(type).toHaveProperty('Category');

            expect(typeof type.id).toEqual('number');
            expect(typeof type.UserId).toEqual('number');
            expect(typeof type.TypeId).toEqual('number');
            expect(typeof type.CategoryId).toEqual('number');
            expect(typeof type.name).toEqual('string');
            expect(typeof type.price).toEqual('string');
            expect(typeof type.description).toEqual('string');
            expect(typeof type.imageUrl).toEqual('string');
            expect(typeof type.location).toEqual('string');
            expect(typeof type.sold).toEqual('boolean');
            expect(typeof type.available).toEqual('boolean');
            expect(typeof type.condition).toEqual('number');
            expect(type.startPrice).toEqual('null');
            expect(type.currentBid).toEqual('null');
            expect(type.currentUserBidName).toEqual('null');
            expect(type.currentUserBidId).toEqual('null');
            expect(typeof type.createdAt).toEqual('string');
            expect(typeof type.updatedAt).toEqual('string');
            expect(typeof type.User).toEqual('object');
            expect(typeof type.Type).toEqual('object');
            expect(typeof type.Category).toEqual('object');
          });

          done();
        });
    });
  });
});
