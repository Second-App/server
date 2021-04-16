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
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('imageUrl');
          expect(res.body).toHaveProperty('balance');

          expect(typeof res.body.id).toEqual('number');
          expect(typeof res.body.name).toEqual('string');
          expect(typeof res.body.email).toEqual('string');
          expect(typeof res.body.imageUrl).toEqual('string');
          expect(typeof res.body.balance).toEqual('number');

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
/* ----------------------------------------------------------------- */

describe('testing /register', () => {
  // memasukkan nama, memasukkan email yang belom terdaftar, dan memasukkan password yang sesuai syarat
  describe('input name, input email that has not been registered, and input password meet requirement', () => {
    it('It should return status 201 and newly created user data', (done) => {
      const body = {
        name: 'nameOfUser',
        email: 'User2@mail.com',
        password: 'User123',
      };
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(201);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('imageUrl');
          expect(res.body).toHaveProperty('balance');
          expect(res.body).toHaveProperty('access_token');

          expect(typeof res.body.id).toEqual('number');
          expect(typeof res.body.name).toEqual('string');
          expect(typeof res.body.email).toEqual('string');
          expect(typeof res.body.imageUrl).toEqual('string');
          expect(typeof res.body.balance).toEqual('number');
          expect(typeof res.body.access_token).toEqual('string');

          done();
        });
    });
  });

  // tidak memasukkan nama, memasukkan email yang belom terdaftar, dan memasukkan password yang sesuai syarat
  describe('not inputting name, input email that has not been registered, and input password meet requirement', () => {
    it('It should return 400 and error message', (done) => {
      const body = {
        name: '',
        email: 'User@mail.com',
        password: 'wrongPassword',
      };
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Input name should not be empty');

          done();
        });
    });
  });

  // memasukkan nama, memasukkan email yang sudah terdaftar, dan memasukkan password yang sesuai syarat
  describe('input name, input email that has been registered, and input password meet requirement', () => {
    it('It should return 400 and error message', (done) => {
      const body = {
        name: 'nameOfUser',
        email: 'User@mail.com',
        password: 'User123',
      };
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Email already registered');

          done();
        });
    });
  });

  // memasukkan nama, memasukkan format email yang salah, dan memasukkan password yang sesuai syarat
  describe('input name, input email that has been registered, and input password meet requirement', () => {
    it('It should return 400 and error message', (done) => {
      const body = {
        name: 'nameOfUser',
        email: 'email.com',
        password: 'User123',
      };
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual('Invalid email format');

          done();
        });
    });
  });

  // memasukkan nama, memasukkan email yang belom terdaftar, dan memasukkan password tidak sesuai syarat
  describe('inputting name, input email that has not been registered, and input password that not meet requirement', () => {
    it('It should return 400 and error message', (done) => {
      const body = {
        name: 'nameOfUser',
        email: 'User2@mail.com',
        password: 'Aa1',
      };
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.status).toEqual(400);
          expect(typeof res.body).toEqual('object');

          expect(res.body).toHaveProperty('msg');

          expect(typeof res.body.msg).toEqual('string');
          expect(res.body.msg).toEqual(
            'Password must be at least contain a capital letter, a number or symbol, and minimum of 6 characters'
          );

          done();
        });
    });
  });
});

/* ----------------------------------------------------------------- */
/* ----------------------------------------------------------------- */
