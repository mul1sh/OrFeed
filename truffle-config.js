import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from "web3";
const web3 = new Web3();
// the mnemonic phrase to an account with some ETH in the respective network
const mnemonic = process.env.MNEMONIC;

// the infura project id's
const infuraProjectID = process.env.INFURA_PROJECT_ID;


export const networks = {
  mainnet: {
    provider: function () {
      return new HDWalletProvider(mnemonic, `https://mainnet.infura.io/${infuraProjectID}`);
    },
    gasPrice: web3.utils.toWei('10', 'gwei'),
    network_id: 1
  },
  kovan: {
    provider: function () {
      return new HDWalletProvider(mnemonic, `https://kovan.infura.io/${infuraProjectID}`);
    },
    gasPrice: web3.utils.toWei('10', 'gwei'),
    network_id: 42
  },
  rinkeby: {
    provider: function () {
      return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/${infuraProjectID}`);
    },
    gasPrice: web3.utils.toWei('10', 'gwei'),
    network_id: 4
  }
};
export const compilers = {
  solc: {
    version: '0.4.26'
  }
};