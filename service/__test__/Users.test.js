const request = require('supertest');
const app = require('../app.js');

describe('testing /login', () => {
  // email dan password benar
  describe('correct email and password', () => {
    it('It should return status 200 and user data', (done) => {
      const body = {
        email: 'User@mail.com',
        password: 'User123',
      };
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');

          expect(typeof res.body.id).toEqual('number');
          expect(typeof res.body.email).toEqual('string');

          done();
        });
    });
  });

  // email benar, password salah
  describe('correct email but wrong password', () => {
    it('It should return 400 and error message', (done) => {
      const body = {
        email: 'User@mail.com',
        password: 'wrongPassword',
      };
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Invalid Email or Password');

          done();
        });
    });
  });

  // email tidak ada di database
  describe('email not found in database', () => {
    it('It should return 400 and error message', (done) => {
      const body = {
        email: 'wrongEmail@mail.com',
        password: 'User123',
      };
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Invalid Email or Password');

          done();
        });
    });
  });

  // tidak memasukkan email dan password
  describe('empty input email and input password', () => {
    it('It should return 400 and error message', (done) => {
      const body = {
        email: '',
        password: '',
      };
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Invalid Email or Password');

          done();
        });
    });
  });
});

/* ----------------------------------------------------------------- */
