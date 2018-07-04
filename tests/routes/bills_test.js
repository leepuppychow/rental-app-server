const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');

chai.use(chaiHttp);

// NEED TO PASS IN AUTHENTICATION HEADERS

describe('GET /bills', () => {
  it('should get all bills', (done) => {
    chai.request(server)
    .get('/api/v1/bills')
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(200);

      console.log(res.body);
    })
    done();
  })

});


