'use strict';

require('babel-register')({
    presets: [ 'env' ]
})

var test = require('tape')
var request = require('supertest-session')
//var sessionRequest = require('supertest-session')
var app = require('../server')

test('POST /signup - ERROR A user with the username already exists', function (t) {
  request(app)
    .post('/signup')
    .send({username: 'maxaxeldaniel@gmail.com', password: 'Avatar56.', info: 'Maxime Daniel|Designer'})
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.notEqual(200, res.status, `ERROR ${res.text}`)
    })
    .end( (err, res) => {
      t.end();
    });
});


test('POST /signin - ERROR Invalid username', function (t) {
  request(app)
    .post('/signin')
    .send({username: 'maxaxeldaniel@gmail.co', password: 'Avatar56.'})
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.notEqual(200, res.status, `ERROR ${res.text}`)
    })
    .end( (err, res) => {
     t.end();
    });
});

test('POST /signin - ERROR Invalid password', function (t) {
  request(app)
    .post('/signin')
    .send({username: 'maxaxeldaniel@gmail.com', password: 'Avatar56'})
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.notEqual(200, res.status, `ERROR ${res.text}`)
    })
    .end( (err, res) => {
     t.end();
    });
});

test('POST /signin - Error Missing parameter', function (t) {
  request(app)
    .post('/signin')
    .send({})
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.notEqual(200, res.status, `ERROR ${res.text}`)
    })
    .end( (err, res) => {
     t.end();
    });
});


test('POST /signin - OK', function (t) {
  request(app)
    .post('/signin')
    .send({username: 'maxaxeldaniel@gmail.com', password: 'Avatar56.'})
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.equal(200, res.status, `OK ${res.text}`)
    })
    .end( (err, res) => {
      t.end();
    });
});

test('POST /api/projectList - OK', function (t) {
  request(app)
    .get('/api/projectList')
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.equal(200, res.status, `OK ${res.text}`)
    })
    .end( (err, res) => {
      t.end();
    });
});
