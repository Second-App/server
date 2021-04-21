const request = require('supertest');
const app = require('../app.js');
const { generateToken } = require('../helpers/jwt.js');
const { seederUser } = require('./seeder');
const { User } = require('../models');

// SEEDERS jangan lupa assign user id ke variabel UserId, cek line 293
let access_token;
let UserId;

describe('USER TEST CASE', () => {
  beforeAll((done) => {
    seederUser()
      .then(() => {
        return User.findOne();
      })
      .then((data) => {
        const user = {
          id: data.id,
          name: data.name,
          email: data.email,
        };
        UserId = user.id;
        access_token = generateToken(user);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  afterAll((done) => {
    User.destroy({ where: {} })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  describe('testing /login', () => {
    // email dan password benar
    describe('correct email and password', () => {
      it('It should return status 200 and user data', (done) => {
        const body = {
          email: 'User3@mail.com',
          password: 'User123',
        };
        request(app)
          .post('/users/login')
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

    // email benar, password salah
    describe('correct email but wrong password', () => {
      it('It should return 400 and error msg', (done) => {
        const body = {
          email: 'User@mail.com',
          password: 'wrongPassword',
        };
        request(app)
          .post('/users/login')
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
      it('It should return 400 and error msg', (done) => {
        const body = {
          email: 'wrongEmail@mail.com',
          password: 'User123',
        };
        request(app)
          .post('/users/login')
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
      it('It should return 400 and error msg', (done) => {
        const body = {
          email: '',
          password: '',
        };
        request(app)
          .post('/users/login')
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
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };
        request(app)
          .post('/users/register')
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

            expect(typeof res.body.id).toEqual('number');
            expect(typeof res.body.name).toEqual('string');
            expect(typeof res.body.email).toEqual('string');
            expect(typeof res.body.imageUrl).toEqual('string');
            expect(typeof res.body.balance).toEqual('number');

            done();
          });
      });
    });

    // tidak memasukkan nama, memasukkan email yang belom terdaftar, dan memasukkan password yang sesuai syarat
    describe('not inputting name, input email that has not been registered, and input password meet requirement', () => {
      it('It should return 400 and error msg', (done) => {
        const body = {
          name: '',
          email: 'User@mail.com',
          password: 'wrongPassword',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };
        request(app)
          .post('/users/register')
          .send(body)
          .end((err, res) => {
            if (err) {
              done(err);
            }

            expect(res.status).toEqual(400);
            expect(typeof res.body).toEqual('object');

            expect(res.body).toHaveProperty('msg');
            expect(Array.isArray(res.body.msg)).toEqual(true);
            expect(res.body.msg).toEqual(
              expect.arrayContaining([
                'Password must be at least contain a capital letter, a number or symbol, and minimum of 6 characters',
                'Input name should not be empty',
              ])
            );
            done();
          });
      });
    });

    // memasukkan nama, memasukkan email yang sudah terdaftar, dan memasukkan password yang sesuai syarat
    describe('input name, input email that has been registered, and input password meet requirement', () => {
      it('It should return 400 and error msg', (done) => {
        const body = {
          name: 'nameOfUser',
          email: 'User3@mail.com',
          password: 'User123',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };
        request(app)
          .post('/users/register')
          .send(body)
          .end((err, res) => {
            if (err) {
              done(err);
            }

            expect(res.status).toEqual(400);
            expect(typeof res.body).toEqual('object');

            expect(res.body).toHaveProperty('msg');

            expect(res.body).toHaveProperty('msg');
            expect(Array.isArray(res.body.msg)).toEqual(true);
            expect(res.body.msg).toEqual(
              expect.arrayContaining(['Email already registered'])
            );

            done();
          });
      });
    });

    // memasukkan nama, memasukkan format email yang salah, dan memasukkan password yang sesuai syarat
    describe('input name, input email that has been registered, and input password meet requirement', () => {
      it('It should return 400 and error msg', (done) => {
        const body = {
          name: 'nameOfUser',
          email: 'email.com',
          password: 'User123',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };
        request(app)
          .post('/users/register')
          .send(body)
          .end((err, res) => {
            if (err) {
              done(err);
            }

            expect(res.status).toEqual(400);
            expect(typeof res.body).toEqual('object');

            expect(res.body).toHaveProperty('msg');

            expect(res.body).toHaveProperty('msg');
            expect(Array.isArray(res.body.msg)).toEqual(true);
            expect(res.body.msg).toEqual(
              expect.arrayContaining(['Invalid email format'])
            );

            done();
          });
      });
    });

    // memasukkan nama, memasukkan email yang belom terdaftar, dan memasukkan password tidak sesuai syarat
    describe('inputting name, input email that has not been registered, and input password that not meet requirement', () => {
      it('It should return 400 and error msg', (done) => {
        const body = {
          name: 'nameOfUser',
          email: 'User2@mail.com',
          password: 'Aa1',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };
        request(app)
          .post('/users/register')
          .send(body)
          .end((err, res) => {
            if (err) {
              done(err);
            }

            expect(res.status).toEqual(400);
            expect(typeof res.body).toEqual('object');

            expect(res.body).toHaveProperty('msg');

            expect(res.body).toHaveProperty('msg');
            expect(Array.isArray(res.body.msg)).toEqual(true);
            expect(res.body.msg).toEqual(
              expect.arrayContaining([
                'Password must be at least contain a capital letter, a number or symbol, and minimum of 6 characters',
              ])
            );
            done();
          });
      });
    });
  });

  /* ----------------------------------------------------------------- */
  /* ------------------------GET users data-------------------------------- */

  describe('testing sers GET by id /users/:id', () => {
    // ID terdaftar di database
    describe('User ID registered in the database', () => {
      it('It should return with status code 200 and return user data', (done) => {
        request(app)
          .get(`/users/${UserId}`)
          .send()
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) done(err);

            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('id', expect.any(Number));
            expect(res.body).toHaveProperty('name', expect.any(String));
            expect(res.body).toHaveProperty('email', expect.any(String));
            expect(res.body).toHaveProperty('imageUrl', expect.any(String));
            expect(res.body).toHaveProperty('balance', expect.any(Number));
            done();
          });
      });
    });
  });

  /* ----------------------------------------------------------------------- */
  /* ------------------------EDIT users data-------------------------------- */

  describe('testing PUT by id /users/:id', () => {
    // ID terdaftar di database
    describe('PUT SUCCESS CASE', () => {
      it('It should return with status code 200 and return msg', (done) => {
        const body = {
          name: 'fullname user',
          email: 'user2@mail.com',
          password: 'User1234',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };

        request(app)
          .put(`/users/${UserId}`)
          .send(body)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) done(err);

            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('msg', 'data updated');
            done();
          });
      });
    });

    describe('PUT FAILED CASE: access token not sent', () => {
      it('It should return with status code 401', (done) => {
        const body = {
          name: 'fullname user',
          email: 'user2@mail.com',
          password: 'User1234',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };

        request(app)
          .put(`/users/${UserId}`)
          .send(body)
          .end((err, res) => {
            if (err) done(err);

            expect(res.statusCode).toBe(401);
            done();
          });
      });
    });

    describe('PUT FAILED CASE: access token is wrong', () => {
      it('It should return with status code 401', (done) => {
        const body = {
          name: 'fullname user',
          email: 'user2@mail.com',
          password: 'User1234',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };

        request(app)
          .put(`/users/${UserId}`)
          .send(body)
          .set('access_token', 'bukantokenadmin')
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toBe(401);
            expect();
            done();
          });
      });
    });

    describe('PUT FAILED CASE: empty name field', () => {
      it('It should return with status code 404', (done) => {
        const body = {
          name: '',
          email: 'user2@mail.com',
          password: 'User1234',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };

        request(app)
          .put(`/users/${UserId}`)
          .send(body)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toEqual(400);
            expect(typeof res.body).toEqual('object');

            expect(res.body).toHaveProperty('msg');

            expect(Array.isArray(res.body.msg)).toEqual(true);
            expect(res.body.msg).toEqual(
              expect.arrayContaining(['Input name should not be empty'])
            );
            done();
          });
      });
    });

    describe('PUT FAILED CASE: empty email field', () => {
      it('It should return with status code 404', (done) => {
        const body = {
          name: 'fullname user',
          email: '',
          password: 'User1234',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };

        request(app)
          .put(`/users/${UserId}`)
          .send(body)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toEqual(400);
            expect(typeof res.body).toEqual('object');

            expect(res.body).toHaveProperty('msg');

            expect(Array.isArray(res.body.msg)).toEqual(true);
            expect(res.body.msg).toEqual(
              expect.arrayContaining(['Invalid email format'])
            );

            done();
          });
      });
    });

    describe('PUT FAILED CASE: invalid email format', () => {
      it('It should return with status code 404', (done) => {
        const body = {
          name: 'fullname user',
          email: 'usermail.com',
          password: 'User1234',
          ktpURL:
            'https://1.bp.blogspot.com/-oAUps6kC-f8/WR7lPMpJGJI/AAAAAAAAAjQ/Nf__sQzVt0Y6PHk7XeUp9V_dbSwvl_UugCLcB/s400/KTP.png',
          address: 'Jakarta, Indonesia',
        };

        request(app)
          .put(`/users/${UserId}`)
          .send(body)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toEqual(400);
            expect(typeof res.body).toEqual('object');

            expect(res.body).toHaveProperty('msg');

            expect(Array.isArray(res.body.msg)).toEqual(true);
            expect(res.body.msg).toEqual(
              expect.arrayContaining(['Invalid email format'])
            );

            done();
          });
      });
    });
  });

  /* ----------------------------------------------------------------- */
  /* ------------------------DELETE users data-------------------------------- */

  describe("DELETE user's data", () => {
    describe('DELETE SUCCESS CASE', () => {
      it('It should return with status code 200 and return a msg', (done) => {
        request(app)
          .delete(`/users/${UserId}`)
          .set('access_token', access_token)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('msg');
            expect(res.body.msg).toEqual('user deleted');
            done();
          });
      });
    });

    describe('DELETE FAILED CASE: access token wrong/failed', () => {
      it('It should return with status code 401', (done) => {
        request(app)
          .delete(`/users/${UserId}`)
          .set('access_token', 'bukantokennya')
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(401);
            done();
          });
      });
    });

    describe('DELETE FAILED CASE: access token not included', () => {
      it('It should return with status code 401', (done) => {
        request(app)
          .delete(`/users/${UserId}`)
          // .set('access_token',)
          .end((err, res) => {
            if (err) done(err);
            expect(res.statusCode).toEqual(401);
            done();
          });
      });
    });
  });
});
