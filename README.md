# NFTtrade . 🔥

NFT trade is a decentralized web platform allowing to easily mint, stored and trade unique NFT Art Work. The app support royalties payment for the Artist whenever their work is exchanged on the platform. Once your collection created, it is the available to be minted by anyone. Any minted NFT car thereafter be transferred to the marketplace to be traded.

 [ℹ️ Website](https://NFTrate.com)

# Tour of the application

![image](https://user-images.githubusercontent.com/68705151/183306310-264e8d63-d122-4b28-b63e-280bac4910fd.png)

  * To buy an NFT
  Connect your wallet and naviguate to marketplace or profile
  
  * To mint an NFT
   Connect your wallet and naviguate to the collection and click mint. If button does not appear, the nft if not to be minted
   
   ![image](https://user-images.githubusercontent.com/68705151/183306486-4c39335b-66d4-409e-8864-e87e8d711f8c.png)

  * To create your NFT collection
	
 	Create your art work: you can use HashLips [ℹ️ Website] (https://hashlips.online/HashLips)
	
  	Upload your files: ensure that one folder contains your metadata file and art. Each file and related metadata should be named using incrementing numbers from 1.[png] to last image. [files types] (.png, .gif, .jpg, .jpeg)
  
	Fill the form with the same information that you put into your metadata. Those informations are kept on chains
	![image](https://user-images.githubusercontent.com/68705151/183306391-34165878-1886-477e-8d77-ab14753d4e9e.png)

	Create an NFT should pop up a metamask confirmation. ![image](https://user-images.githubusercontent.com/68705151/183306866-90fa676c-4303-4047-83ef-03e9f0e6a064.png)

	- Once transaction done, navigate to profile to see your collection. 
  
	- Use Minted button to mint an NFT
  
	- Once NFT are minted, they can be sell on the platform
  
	- Navigate to your profile
	
	-Have a look into our collection 
	![image](https://user-images.githubusercontent.com/68705151/183306334-44f107a5-23ae-4394-9277-d95d2a863e9e.png)
	
	- If you like other people to buy it, use "Sell this NFT" button, with your price in ETH, to list your NFT on the exchange
		-approve the market place to handle your NFT
		![image](https://user-images.githubusercontent.com/68705151/183306962-da89d4d5-5064-4639-99af-5e888d71a6c7.png)
		-grant the transaction to transfer your NFT
		![image](https://user-images.githubusercontent.com/68705151/183307016-e3f8957c-0d6c-4092-8dd2-f1fba5269e70.png)

		![image](https://user-images.githubusercontent.com/68705151/183306723-47a7a105-63c7-4dc7-8b9a-f6ca2ea152a0.png)
	
	-To sell your NFT
	
	-if you lost your way, just ask Cyril, our web3 dev and professor (big up to him !)  ;)
	![image](https://user-images.githubusercontent.com/68705151/183306540-ad1ab417-c649-4294-815e-ee89695e821c.png)

	
 # Built Using

  * This project was built using multiple frameworks, the most notable ones being below.
  
	      Truffle suite 

	      ReactJS 

	      OpenZeppelin-Contracts

	      Compiler Pragma solidity 0.8.14

## Installation

First ensure you are in an empty directory.

     # Clone the repository:  
      git clone https://github.com/quent043/ntf-marketplace.git
      install the dependencies of our project : npm i install
       run ganache

     # Testing

      To test the contracts for functionality run the command below

       truffle test

     # Deployment

    In order to deploy the contracts on a blockchain run ganache or anyother network
      deploy to ganache truffle migrate --network develop

     # Start web server

    Start the web server from the client folder :
         cd client
         npm start
            Starting the development server...

## Improvement

	- Our NFT factory is approching 24576 bytes, the limit introduced in Spurious Dragon. We might need to down-size this file to increase gas deployment efficiency.
	- We decided to handle fungible token using ERC 1155 implementation. However, we did not have the time to include those functionalities in our app. We are going to implement this feature in the near future.
	- We also decided to optimise IPFS upload to make the procedure easy, efficient and error free.
	- We currently do not handle events, pop up for user interaction , and some error management still missing, we will add those features soon.
	

## Contact our team

  For any question, Feel free to contact our team at the address cryptokeymakers@gmail.com.

## FAQ

- __How do I use this with Ganache (or any other network)?__

  The Truffle project is set to deploy to Ganache by default. If you'd like to change this, it's as easy as modifying the Truffle config file! Check out [our documentation on adding network configurations](https://trufflesuite.com/docs/truffle/reference/configuration/#networks). From there, you can run `truffle migrate` pointed to another network, restart the React dev server, and see the change take place.

- __Where can I get more information?__

  For any question, Feel free to contact our team at the address cryptokeymakers@gmail.com.
    ``` 
