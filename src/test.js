const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("./server");
const userService = require("./service/user.service");
const tokenService = require("./service/token.service");
const { isIpBlocked } = require("./service/rateLimiter.service"); 

chai.use(chaiHttp);
const { expect } = chai;

describe("Auth Controller Tests", function () {
  let isBlockedStub;
  let signUpStub;
  let signInStub;
  let generateAccessTokenStub;
  let generateRefreshTokenStub;

  beforeEach(() => {
    signUpStub = sinon.stub(userService, "signUp").resolves({ _id: "123", username: "09121000000" });
    signInStub = sinon.stub(userService, "signIn").resolves({ _id: "123", username: "09352000000" });
    generateAccessTokenStub = sinon.stub(tokenService, "generateAccessToken").returns("mockAccessToken");
    generateRefreshTokenStub = sinon.stub(tokenService, "generateRefreshToken").returns("mockRefreshToken");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should sign up a user and return a JWT", async function () {
    const res = await chai.request(app).post("/signup").send({
      username: "09123003003",
      password: "123456"
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message").equal("User signed up successfully");
    expect(generateAccessTokenStub.calledOnce).to.be.true;
    expect(generateRefreshTokenStub.calledOnce).to.be.true;
  });

  it("should fail sign up if IP is blocked", async function () {
    isBlockedStub.resolves(true);

    const res = await chai.request(app).post("/signup").send({
      username: "09121001001",
      password: "123456"
    });

    expect(res.status).to.equal(503);
    expect(res.text).to.equal("Service Unavailable");
  });

  it("should log in a user and return a JWT", async function () {
    const res = await chai.request(app).post("/login").send({
      username: "09121001001",
      password: "123456"
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message").equal("User logged in successfully");
    expect(generateAccessTokenStub.calledOnce).to.be.true;
    expect(generateRefreshTokenStub.calledOnce).to.be.true;
  });

  it("should fail login if IP is blocked", async function () {
    isBlockedStub.resolves(true);

    const res = await chai.request(app).post("/login").send({
      username: "09121001001",
      password: "123456"
    });

    expect(res.status).to.equal(503);
    expect(res.text).to.equal("Service Unavailable");
  });
});
