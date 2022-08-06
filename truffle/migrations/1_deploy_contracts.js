const Marketplace = artifacts.require("Marketplace");
const NftFactory = artifacts.require("NftFactory");
const TokenOwnershipRegister = artifacts.require("TokenOwnershipRegister");

module.exports = async (deployer) => {
  await deployer.deploy(TokenOwnershipRegister);
  await deployer.deploy(NftFactory, TokenOwnershipRegister.address);
  const TokenOwnershipRegisterInstance = await TokenOwnershipRegister.deployed();
  TokenOwnershipRegisterInstance.setFactoryAddress(NftFactory.address);
  await deployer.deploy(Marketplace, 500);
};
