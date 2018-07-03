const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');

chai.use(chaiHttp);

// NEED TO PASS IN AUTHENTICATION HEADERS

describe('GET /properties', () => {
  it('should get all properties/', (done) => {
    chai.request(server)
    .get('/api/v1/properties')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);

      console.log(res.body);
    })
    done();
  })

});




// const assert = require('assert')
// const app = require('../server')
// const request = require('request')
// const fixtures = require('./fixtures')

// describe("Server", () => {

//   before(done => {
//     this.port = 9876

//     this.server = app.listen(this.port, (err, result) => {
//       if (err) {return done(err)}
//       done()
//     })

//     this.request = request.defaults({
//       baseUrl: 'http://localhost:9876'
//     })
//   })

//   after(() => {
//     this.server.close()
//   })

//   it("should exist", () => {
//     assert(app)
//   })

//   describe("GET /", () => {
//     it("should have a body with the name of the application", (done) => {
//       var title = app.locals.title

//       this.request.get('/', (error, response) => {
//         if (error) { done(error) }
//         assert.equal(response.statusCode, 200)
//         assert(response.body.includes(title), `"${response.body}" does not include "${title}".`)
//         done()
//       })
//     })
//   })

//   describe('POST /trains', () => {

//     beforeEach(() => {
//       app.locals.trains = {}
//     })

//     it("should not return 404", (done) => {
//       this.request.post("/trains", (error, response) => {
//         if (error) { done(error) }
//         assert.notEqual(response.statusCode, 404)
//         done()
//       })
//     })

//     it("should receive and store data", (done) => {
//       var payload = { train: fixtures.validTrain }

//       this.request.post('/trains', { form: payload }, (error, response) => {
//         if (error) { done(error) }
//         var trainCount = Object.keys(app.locals.trains).length

//         assert.equal(trainCount, 1, `Expected 1 trains, found ${trainCount}`)

//         done()
//       })

//     })
//   })

//   describe('GET /trains/:id', () => {
//     beforeEach(() => {
//       app.locals.trains.testTrain = fixtures.validTrain
//     })

//     it("should not get a 404", () => {
//       this.request.get('/trains/testTrain', (error, response) => {
//         if (error) { done(error) }
//         assert.notEqual(response.statusCode, 404)
//         done()
//       })
//     })

//     it("should get info on one train", () => {
//       var train = app.locals.trains.testTrain

//       this.request.get('/trains/testTrain', (error, response) => {
//         if (error) { done(error) }
//         assert(response.body.includes(train.name),
//             `"${response.body}" does not include "${train.name}".`)
//         done()
//       })
//     })
//   })


// })
