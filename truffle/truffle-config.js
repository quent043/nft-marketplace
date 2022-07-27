const path = require("path");
const HDWalletProvider = require('../node_modules/@truffle/hdwallet-provider');
require('../node_modules/dotenv').config();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  contracts_build_directory: "../client/src/contracts",
  networks: {
    develop: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    advanced: {
      port: 8777,             // Custom port
      network_id: 1342,       // Custom network
      gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
      gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
      // from: <address>,        // Account to send transactions from (default: accounts[0])
      websocket: true         // Enable EventEmitter interface for web3 (default: false)
    },
    ropsten: {
      provider: () => new HDWalletProvider(
          {
            mnemonic:
                {
                  phrase:`${process.env.MNEMONIC}`
                },
            // providerOrUrl: `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_ID}`
            providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`
          }),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200000,
      networkCheckTimeout: 2000000,// # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    kovan: {
      provider: () => new HDWalletProvider({mnemonic: {phrase:`${process.env.MNEMONIC}`}, providerOrUrl: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`}),
      network_id: 42,   // This network is yours, in the cloud.
      production: true,    // Treats this network as if it was a public net. (default: false)
      gas: 5000000,
      gasPrice: 25000000000
    },
    rinkeby: {
      provider: () => new HDWalletProvider({mnemonic: {phrase:`${process.env.MNEMONIC}`}, providerOrUrl: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`}),
      network_id: 4,   // This network is yours, in the cloud.
      production: true,    // Treats this network as if it was a public net. (default: false)
      timeoutBlocks: 200000,
      networkCheckTimeout: 2000000,
    },
    goerli: {
      provider: () => new HDWalletProvider({mnemonic: {phrase:`${process.env.MNEMONIC}`}, providerOrUrl: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`}),
      network_id: 5,   // This network is yours, in the cloud.
      production: true    // Treats this network as if it was a public net. (default: false)
    }
  },



  // Set default mocha options here, use special reporters, etc.
  plugins: ["solidity-coverage"],

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.14",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows:
  // $ truffle migrate --reset --compile-all
  //
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "sqlite",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};
