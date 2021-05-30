var Transct = artifacts.require("./Transct.sol");

module.exports = function(deployer) {
  deployer.deploy(Transct);
};
