const request = require('supertest');
const app = require('../app.js');

describe('POST new items to cart', ()) => {
  describe("POST SUCCESS CASE", () => {
    it("It should return with status code 201 and return new data", (done) => {
      const body = {
        UserId: Number,
        ProductId: Number
      }

      request(app)
      .post('/carts')
      .send(body)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('id', expect.any(Number))
        expect(typeof res.body.id).toEqual('number')
        expect(res.body).toHaveProperty('ProductId', expect.any(Number))
        expect(typeof res.body.id).toEqual('number')
        expect(res.body).toHaveProperty('ProductId', expect.any(Number))
        expect(typeof res.body.id).toEqual('number')
        expect(res.body).toHaveProperty('Product', expect.any(Array))
        done()
      })
    })
  })
}

/*************** PATCH item in Cart *****************/
/*****************************************************/

describe("PATCH cart by adding products value", () => {

  describe("PATCH SUCCESS: add to cart", () => {
    const body = {
      ProductId: 1
    }
    it("Should return with status code 200", (done) => {
      request(app)
      .patch(`/carts/${CartId}`)
      .send(body)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'Cart updated')
        done()
      })
    })
  })

  describe("PATCH FAILED: add to cart where products is null", () => {
    const body = {
      ProductId: null
    }
    it("Should return with status code 400", (done) => {
      request(app)
      .patch(`/carts/${CartId}`)
      .send(body)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(400)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'Product failed to add to cart')
        done()
      })
    })
  })

  describe("DELETE SUCCESS: delete cart", () => {
    const body = {
      ProductId: 1
    }
    it("Should return with status code 200", (done) => {
      request(app)
      .delete(`/carts/${CartId}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('message', 'Cart deleted')
        done()
      })
    })
  })
})
