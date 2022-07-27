const Marketplace = artifacts.require("Marketplace");
const NFTFactory = artifacts.require("NFTFactory");

module.exports = function (deployer) {
  deployer.deploy(Marketplace);
  deployer.deploy(NFTFactory);
};
