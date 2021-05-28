var contracts  = artifacts.require("./contracts.sol");

module.exports = function(deployer) {
  deployer.deploy(contracts);
};
