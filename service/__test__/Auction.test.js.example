const request = require('supertest');
const app = require('../app.js');
const { User, Product, Auction} = require('../models')
const { seederUser } = require('./seeder')
const { generateToken } = require('../helpers/jwt.js');

let access_token
let idUser
let ProductId

describe("AUCTION TEST CASE", () => {
  beforeAll((done) => {
    seederUser()
    .then(() => {
      return User.findOne()
    })
    .then((data) => {
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
      return Auction.create({UserId:idUser, ProductId, startPrice: 30000, multiplier: 5000})
    })
    .then(() => {
      return Auction.findOne()
    })
    .then((auction) => {
      
      AuctionId = auction.id
      done()
    })
    .catch((err) => {
      done(err)
    })
  })

  afterAll((done) => {
    User.destroy({ where: {}})
    .then(() => {
      return Product.destroy({ where: {}})
    })
    .then(() => {
      return Auction.destroy({ where: {}})
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  describe('GET auctions', () => {
    it("It should returned with status code 200", (done) => {
      request(app)
      .get('/auctions/')
      .send()
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toEqual(true)
        expect(res.body).toEqual(
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
          UserId: idUser,
          ProductId,
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
            expect(res.body).toHaveProperty('msg', 'auction created')
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
        currentBid: 45000
      };
      it('Should return with status code 200', (done) => {
        request(app)
          .patch(`/auctions/${AuctionId}`)
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
  
    describe('PATCH FAILED: add to auction where bid is not multiplied of multiplier value', () => {
      const body = {
        currentBid: 36000
      };
      it('Should return with status code 404', (done) => {
        request(app)
          .patch(`/auctions/${AuctionId}`)
          .send(body)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(404);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty(
              'msg',
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
        .delete(`/auctions/${AuctionId}`)
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
})
