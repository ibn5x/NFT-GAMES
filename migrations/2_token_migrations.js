const Token = artifacts.require("Token");

module.exports = async function (deployer) {
  await deployer.deploy(Token, "Enjimon", "EJM");
  let tokenInstance = await Token.deployed();
  await tokenInstance.mint(100, 200, 100000, 1); //this is token id 0
  let enjimon = await tokenInstance.getTokenDetails(0); //calling a our contract function test

  console.log(enjimon);
};