
/**
 * before to start install dependandies 
 * npm install @truffle/hdwallet-provider
 * npm install --save-dev @openzeppelin/test-helpers
 * npm install --save-dev chai
 */
const { BN, ether, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const NFTFactory = artifacts.require("NftFactory");
const Marketplace = artifacts.require("Marketplace");
const NFTCollection = artifacts.require("NFTCollection");

contract('NFTFactory Contract Test Suite', accounts => {

    const owner = accounts[0];
    const seller = accounts[1];
    const purchasers = accounts[2];
    const _uri = "QmcB83hiy2Q662MqHrYnJaTsAGr9VuNNemjJe9AAx1MALx"
    const _max_mint_allowed = 10;
    const _max_supply = 10;
    const _amountOfNft = 1;

    const sftCollectionData =
        [
            [
                "_name",
                "_description",
                "_image",
                1,
                1,
                10,
                10
            ],
            [
                "_name2",
                "_description2",
                "_image2",
                1,
                2,
                10,
                10
            ]
        ];

    const nftCollectionData =
        [
            [
                "_name",
                "_description",
                "_image",
                1,
                1
            ]
        ];


    function buildNewInstanceNFTFactory() {
        return NFTFactory.new({ from: owner });
    }

    function buildNewInstanceNFTCollection() {
        return NFTCollection.new();
    }

    function buildNewInstanceMarketplace() {
        return Marketplace.new({ from: owner });
    }

    let instance_NFTFactory;
    let instance_NFTCollection;
    let instance_SFTCollection;

  

    describe('Testing basics function', function () {

        before(async () => {
            instance_NFTFactory = await buildNewInstanceNFTFactory();
        });

    
        it('should be valid to test mechanism', () => {
            expect(true).to.be.true;
        });

        it('should create a new contract instance', async () => {
            expect(instance_NFTFactory.address).to.be.not.null;
        });
    });


    describe("Tests related to the deployement of the contract at the right address", async function () {

        before(async () => {
            instance_NFTFactory = await buildNewInstanceNFTFactory();
        });
    

        //assess the contract is deployed to owner address
        it("Should match the owner address", async function () {
            expect(await instance_NFTFactory.owner()).to.equal(owner);
        });

        it("Should NOT match the seller address", async function () {
            expect(await instance_NFTFactory.owner()).not.to.equal(seller);
        });
    });


    describe("NFTFatory : Fonction createNftCollection", async function () {

        before(async () => {
            instance_NFTFactory = await buildNewInstanceNFTFactory();
        });
    

        it('should require 5 parameters', async () => {
            await expectRevert(instance_NFTFactory.createNftCollection({ from: owner }), 'Invalid number of parameters for "createNftCollection". Got 1 expected 5!');
        });

        it('should emit CollectionDeployed(nftCollectionAddress), OwnershipTransferred', async () => {
            await instance_NFTFactory.createNftCollection(_uri, _max_mint_allowed, _max_supply, nftCollectionData, _amountOfNft).then(response => {

                expectEvent(response, 'CollectionDeployed');
                expectEvent(response, 'OwnershipTransferred', { newOwner: owner });

            });
         });
        });


    describe("NFTCollection", async function () {
        
        before(async () => {
            instance_NFTFactory = await buildNewInstanceNFTFactory();
            await instance_NFTFactory.createNftCollection(_uri, _max_mint_allowed, _max_supply, nftCollectionData, _amountOfNft);
            instance_NFTCollection = await buildNewInstanceNFTCollection();
        });
    
        it('should trigered mint for NFT tokenId = 1', async () => {
                instance_NFTCollection.mintNft(1).then(mintedNft => {
                    expectEvent(mintedNft, 'TokenMinted')
                });
            });

        it('should attribute value 1 to the minter address', async () => {
               let returnAddrtoAmount= instance_NFTCollection.userToMintAmount(owner);
                console.log(returnAddrtoAmount);
                expect(returnAddrtoAmount.to.equal(1))  
            });
            
        });

   /**      it('should trigered withdraw', async () => {
                instance_NFTCollection.withdraw().then(amount => {
                    console.log(amount)
                });
            });
            */ 

        }); 

   
   