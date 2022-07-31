const Marketplace = artifacts.require("Marketplace");
const NFTFactory = artifacts.require("NFTFactory");

module.exports = async (deployer) => {
  await deployer.deploy(Marketplace, 500);
  await deployer.deploy(NFTFactory);
};
