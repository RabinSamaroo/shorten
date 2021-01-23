//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
//let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe("Tests", () => {
  describe("Inital Test Suite", () => {
    let data = { key: "test-key-1", value: "https://www.yahoo.com" };
    it("Create a single document", (done) => {
      chai
        .request(server)
        .post("/" + data.key)
        .send(data)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text.length).to.not.be.eql(0);
          done();
        });
    });
    it("Get a single document", (done) => {
      chai
        .request(server)
        .get("/g")
        .end((err, res) => {
          //should.not.exist(err);
          //res.shoud.have.status(200);
          //res.body.should.be.a('array');
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text.length).to.not.be.eql(0);
          done();
        });
    });
  });
});
