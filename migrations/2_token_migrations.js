const Token = artifacts.require("Token");

module.exports = async function (deployer) {
  await deployer.deploy(Token, "Enjimon", "EJM");
  let tokenInstance = await Token.deployed();
  await tokenInstance.mint("Vitalic Mint", 100, 50, 100000, 1); //this is token id 0
  await tokenInstance.mint("Hure", 160, 180, 50000, 1); //this is token id 1
  await tokenInstance.mint("Boltec", 100, 70, 100000, 1); //this is token id 2
  let enjimon = await tokenInstance.getTokenDetails(2); //calling a our contract function test

  console.log(enjimon);
};