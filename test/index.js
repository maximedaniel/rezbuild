'use strict';

require('babel-register')({
    presets: [ 'env' ]
})

var test = require('tape')
var request = require('supertest-session')
//var sessionRequest = require('supertest-session')
var app = require('../server/server')

test('POST /signup - OK', function (t) {
  request(app)
    .post('/signup')
    .send({username: 'maxaxeldaniel@gmail.fr', password: 'Avatar56.', firstname: 'Maxime', lastname : 'Daniel', roles : ['Designer', 'Customer']})
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.equal(200, res.status, `OK ${res.text}`)
    })
    .end( (err, res) => {
      t.end();
    });
});

test('POST /signin - OK', function (t) {
  request(app)
    .post('/signin')
    .send({username: 'maxaxeldaniel@gmail.fr', password: 'Avatar56.'})
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.equal(200, res.status, `OK ${res.text}`)
    })
    .end( (err, res) => {
      t.end();
    });
});

test('POST /api/createproject - OK', function (t) {
  request(app)
    .post('/api/createproject')
    .send({name: 'TestProject'})
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.equal(200, res.status, `OK ${res.text}`)
    })
    .end( (err, res) => {
      t.end();
    });
});


test('GET /signout - OK', function (t) {
  request(app)
    .get('/signout')
    .set('Accept', 'application/json')
    .expect( (res) => {
        t.equal(200, res.status, `OK ${res.text}`)
    })
    .end( (err, res) => {
      t.end();
    });
});


/*'use strict';

require('babel-register')({
    presets: [ 'env' ]
})

var test = require('tape')
var request = require('supertest-session')
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
});*/
