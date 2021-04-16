const request = require('supertest');
const app = require('../app.js');

describe('GET carts', () => {
  it("It should returned with status code 200", (done) => {
    request(app)
    .get('/deals/')
    .send()
    .set('access_token', access_token)
    .end((err, res) => {
      if (err) done(err)
      expect(res.statusCode).toEqual(200)
      expect(typeof res.body).toEqual('object')
      expect(res.body).toHaveProperty('UserId', expect.any(Number))
      expect(res.body).toHaveProperty('ProductId', expect.any(Number))
      expect(res.body).toHaveProperty('Products', expect.any(Object))
      expect(Array.isArray(res.body.Products)).toEqual(
        expect.arrayContaining([expect.any(Object)])
      )

      done()
    })

  })
})

describe('POST new items to deals', () => {
  describe('POST SUCCESS CASE', () => {
    it('It should return with status code 201 and return new data', (done) => {
      const body = {
        UserId: Number,
        ProductId: Number,
      };

      request(app)
        .post('/deals/')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('id', expect.any(Number));
          expect(typeof res.body.id).toEqual('number');
          expect(res.body).toHaveProperty('ProductId', expect.any(Number));
          expect(typeof res.body.id).toEqual('number');
          expect(res.body).toHaveProperty('ProductId', expect.any(Number));
          expect(typeof res.body.id).toEqual('number');
          expect(res.body).toHaveProperty('Product', expect.any(Array));
          done();
        });
    });
  });
});

describe('DELETE SUCCESS: delete cart', () => {
  const body = {
    ProductId: 1,
  };
  it('Should return with status code 200', (done) => {
    request(app)
      .delete(`/deals/${DealId}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('message', 'Deal deleted');
        done();
      });
  });
});
