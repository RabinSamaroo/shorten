//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
const { before } = require("mocha");
let server = require("../index");
//let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe("Tests", () => {
  describe("Inital Test Suite", () => {
    let data = { key: "test-key-1", value: "https://www.yahoo.com" };
    before("Setup", (done) => {
      chai
        .request(server)
        .delete("/" + data.key)
        .send(data)
        .end((err, res) => {
          done();
        });
    });
    it("Create a single document", (done) => {
      chai
        .request(server)
        .post("/" + data.key)
        .send(data)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(JSON.parse(res.text).status).to.be.eql(
            201
          );
          done();
        });
    });
    it("Read a single document", (done) => {
      chai
        .request(server)
        .get("/" + data.key)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(JSON.parse(res.text).data).to.not.be.eql(data.key);
          done();
        });
    });
    it("Update a single document", (done) => {
      data.value = "https://www.github.com";
      chai
        .request(server)
        .put("/" + data.key)
        .send(data)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(JSON.parse(res.text).status).to.be.eql(200);
          done();
        });
    });
    it("Read an updated document", (done) => {
      chai
        .request(server)
        .get("/" + data.key)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(JSON.parse(res.text).data.value).to.be.eql(data.value);
          done();
        });
    });
    it("Delete the document", (done) => {
      chai
        .request(server)
        .delete("/" + data.key)
        .send(data)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(JSON.parse(res.text).status).to.be.eql(200);
          done();
        });
    });
    it("Confirm document is deleted", (done) => {
      chai
        .request(server)
        .get("/" + data.key)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(JSON.parse(res.text).status).to.be.eql(404);
          done();
        });
 
    })
  });
});
