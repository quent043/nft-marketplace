const Marketplace = artifacts.require("Marketplace");
const NFTFactory = artifacts.require("NftFactory");

module.exports = async (deployer) => {
  await deployer.deploy(Marketplace, 500);
  await deployer.deploy(NFTFactory);
};
