const request = require('supertest');
const app = require('../app.js');

describe('GET auctions', () => {
  it("It should returned with status code 200", (done) => {
    request(app)
    .get('/auctions/')
    .send()
    .set('access_token', access_token)
    .end((err, res) => {
      if (err) done(err)
      expect(res.statusCode).toEqual(200)
      expect(typeof res.body).toEqual('object')
      expect(res.body).toHaveProperty('UserId', expect.any(Number))
      expect(res.body).toHaveProperty('ProductId', expect.any(Number))
      expect(res.body).toHaveProperty('startPrice', expect.any(Number))
      expect(res.body).toHaveProperty('multiplier', expect.any(Number))
      expect(res.body).toHaveProperty('Products', expect.any(Object))
      expect(Array.isArray(res.body.Products)).toEqual(
        expect.arrayContaining([expect.any(Object)])
      )

      done()
    })

  })
})

describe('POST new items to auction', () => {
  describe('POST SUCCESS CASE', () => {
    it('It should return with status code 201 and return new data', (done) => {
      const body = {
        UserId: 1,
        ProductId: 1,
        startPrice: 100000,
        multiplier: 50000
      };

      request(app)
        .post('/auctions')
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(201);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('id', expect.any(Number));
          expect(typeof res.body.id).toEqual('number');
          expect(res.body).toHaveProperty('UserId', expect.any(Number));
          expect(typeof res.body.id).toEqual('number');
          expect(res.body).toHaveProperty('ProductId', expect.any(Number));
          expect(typeof res.body.id).toEqual('number');
          expect(res.body).toHaveProperty('startPrice', expect.any(Number));
          expect(typeof res.body.id).toEqual('number');
          expect(res.body).toHaveProperty('multiplier', expect.any(Number));
          expect(typeof res.body.id).toEqual('number');
          expect(res.body).toHaveProperty('Product', expect.any(Array));
          done();
        });
    });
  });
});

/*************** PATCH item in auction *****************/
/*****************************************************/

describe('PATCH auction by increasing/decreasing multiplier value', () => {
  describe('PATCH SUCCESS: multiplier increased', () => {
    const body = {
      currentBid: 200000
    };
    it('Should return with status code 200', (done) => {
      request(app)
        .patch(`/auctions/${auctionId}`)
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('message', 'bid multiplier increased');
          done();
        });
    });
  });

  describe('PATCH FAILED: add to auction where products is null', () => {
    const body = {
      currentBid: 152000
    };
    it('Should return with status code 400', (done) => {
      request(app)
        .patch(`/auctions/${auctionId}`)
        .send(body)
        .set('access_token', access_token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.statusCode).toEqual(400);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty(
            'message',
            'Bid must be multipled of multiplier value'
          );
          done();
        });
    });
  });

});

/*************** DELETE auction *****************/
/*****************************************************/
describe('DELETE SUCCESS: delete auction', () => {
  const body = {
    ProductId: 1,
  };
  it('Should return with status code 200', (done) => {
    request(app)
      .delete(`/auctions/${auctionId}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('message', 'auction deleted');
        done();
      });
  });
});
