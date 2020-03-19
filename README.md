# OrFeed

[![Build Status](https://travis-ci.com/mul1sh/OrFeedSmartContracts.svg?branch=master)](https://travis-ci.com/mul1sh/OrFeedSmartContracts)

## Decentralized Price Feed and Website Data Provider for Smart Contracts That Need Finance, Sports and Other Miscellaneous Information That Resides On- and/or Off-Chain.

A highly reliable oracle aggregator for Ethereum-based DeFi apps that need financial data from the outside world.

![OrFeed Logo](https://www.orfeed.org/images/orfeed.png)


Website: [orfeed.org](https://www.orfeed.org)

## [Try out](https://www.orfeed.org/explorer) OrFeed

[![Test Drive Button](https://www.orfeed.org/images/testdrive.png)](https://www.orfeed.org/explorer)


[The Reality Stone on the Blockchain](https://medium.com/proof-of-fintech/the-reality-stone-on-the-blockchain-accessible-to-all-1654a3ec71a7) blog post

[How OrFeed Was Conceived](https://medium.com/proof-of-fintech/introducing-orfeed-aa323342d34c) blog post

A [Use-Case](https://medium.com/proof-of-fintech/how-a-penny-can-affect-billions-a88c0837d17e) blog post

[OrFeed DAO](https://medium.com/proof-of-fintech/why-defi-needs-an-oracle-management-dao-8eec65c2e15b) proposal blog post


Etherscan Smart Contract Interface: [https://etherscan.io/dapp/0x8316b082621cfedab95bf4a44a1d4b64a6ffc336](https://etherscan.io/dapp/0x8316b082621cfedab95bf4a44a1d4b64a6ffc336) (Helper: getExchangeRate is a good place to start)

Oracle Price/Numerical Data Registry [dApp](https://etherscan.io/dapp/0x74b5ce2330389391cc61bf2287bdc9ac73757891)

General Data/Event Result Registry [dApp](https://etherscan.io/address/0xd754f58d9d6d705b98bde698f9f9cec0bded1b8a#writeContract) 

[Youtube video tutorial](https://youtu.be/LK1BiSveEI4)


## Getting Started

At the top of your smart contract or in a referenced file in your dApp project, include this interface.

```javascript
interface OrFeedInterface {
  function getExchangeRate ( string fromSymbol, string toSymbol, string venue, uint256 amount ) external view returns ( uint256 );
  function getTokenDecimalCount ( address tokenAddress ) external view returns ( uint256 );
  function getTokenAddress ( string symbol ) external view returns ( address );
  function getSynthBytes32 ( string symbol ) external view returns ( bytes32 );
  function getForexAddress ( string symbol ) external view returns ( address );
  function requestAsyncEvent(string eventName, string source)  external returns(string);
  function getAsyncEventResult(string eventName, string source, string referenceId) external view returns (string);
}
```


To Initialize OrFeed, simply include this code:

```javascript
OrFeedInterface orfeed= OrFeedinterface(0x8316b082621cfedab95bf4a44a1d4b64a6ffc336);

```

One of the best things about OrFeed is that OrFeed automatically detects which kind of asset you are looking for (though the data can come from different providers), as the parameter of "venue" when making the getExchangeRate call. For example, you can get the price for ETH/USD the same way you get the price for JPY/ETH. The 3rd parameter is the venue. Use blank ('') for default oracle. In the future, you can reference several venues/providers to get their data and throw out any that deviate too far from the average.

```javascript
uint jpyusdPrice = orfeed.getExchangeRate("JPY", "USD", "DEFAULT", 100000);
// returns 920 (or $920.00)
```

Note: Replace "DEFAULT" with the oracle provider you would like data from. For example, if you want to know Uniswap's price on the buy side, use "BUY-UNISWAP-EXCHANGE". If you want Kyber's sell side data for the same, you can use "SELL-KYBER-EXCHANGE". Due to the way Bancor works with swaps/liquidity paths, you can simply use "BANCOR" when querying Bancor. Because ERC-20s have many, many integers, when getting prices from token to token, be sure to use very large amounts.... 1000000000 DAI is less than one penny, for example, due to divisibility at 18. 

More examples:

```javascript
uint price = orfeed.getExchangeRate("ETH", "USDC", "BUY-KYBER-EXCHANGE", 100000000000000);
```

```javascript
uint price = orfeed.getExchangeRate("BTC", "DAI", "SELL-UNISWAP-EXCHANGE", 100);
```

```javascript
uint price = orfeed.getExchangeRate("ETH", "DAI", "BANCOR", 1000000000000000);
```

```javascript
uint price = orfeed.getExchangeRate("MKR", "EUR", "", 100000000000000);
```


Experimental:


```javascript
uint price = orfeed.getExchangeRate("AAPL", "USD", "PROVIDER1", 1);
```


Additionally, you can do hacky things like retrieve a "safe" gas price that prevents front-running within your dApp by querying Synthetix's `gasPriceLimit`.


```javascript
uint gasLimit = orfeed.getExchangeRate("skip", "skip", "synthetix-gas-price-limit", 0);
```


## Data And Event Oracles

In addition to pricing and numerical data, string data can also be retrieved using the get `getEventResult` method. You can get string data from registered OrFeed oracles (who can optionally leave notes about how their oracles work and other details). This can be used for sporting events, documents, and notes that one might want to store permanently/temprarily with an expiration for when aliens come and want data on what the human were up to. You can register an oracle via this OrFeed [dApp](https://etherscan.io/address/0xd754f58d9d6d705b98bde698f9f9cec0bded1b8a#writeContract) and set tules for how you would like to return data based on parameters sent (example: /contracts/examples/ProvideDataExamples/userRegisteredDataOrEventOracleExample.sol). Usage for retrieving data example:

```javascript
string memory info = orfeed.getEventResult("skip", "satoshi-first-block");
```
Returns: The Times 03/Jan/2009 Chancellor on brink of second bailout for banks


## Testing

To test that the contracts are working well in the respective networks, please do the following

1. Install `node.js` in your system/environment, if it is not installed already.
2. Install truffle globall, once `node.js` is done installing i.e. `yarn global add truffle` and then install the project dev-dependencies too i.e. `yarn install`
3. Create a `.secrets` file in the root folder of this project, and paste into it the `mnemonic phrase` of the the wallet you want to use for testing in the respective network i.e. mainnet, kovan or rinkeby.
4. Enter the infura `project-ID` for the infura project you are using to test in either of the networks, in the file `truffle-config.js`.
5. Make sure the wallet has enough eth for testing. Atleast `$5` should be enough for both contract deployment and testing.
6. Finally run either of the following commands to test the contracts, depending on the network,
  - `truffle test --mainnet` for the main ethereum network, be careful though as this will cost you real money.
  - `truffle test --kovan` for the kovan test network.
  - `truffle test --rinkeby` for the rinkeby test network.

### Read the full docs [orfeed.org/docs](https://www.orfeed.org/docs)

Common default data providers when venue parameters are left blank are Kyber, Uniswap, Chainlink and Synthetix. 

Future private/premium data may be provided as follows (though we are to suggestions, and welcome you to join the OrFeed DAO where we will be voting on future governance decisions):

![How it all fits together](https://www.orfeed.org/images/diagram.png)


### Works Provided As Inspiration Of Thought Through Development:

[William George, Clément Lesaege: Smart Contract Oracle for Approximating Real-World, Real Number Values](http://drops.dagstuhl.de/opus/volltexte/2019/11396/pdf/OASIcs-Tokenomics-2019-6.pdf)

[Aragon Network Whitepaper](https://github.com/aragon/whitepaper)

[Vitalik Buterin: Minimal Anti-Collusion Infrastructure ](https://ethresear.ch/t/minimal-anti-collusion-infrastructure/5413)


## Contributing

OrFeed's source code is [licensed under the Apache 2.0 license](https://github.com/ProofSuite/OrFeed/blob/master/LICENSE), and we welcome contributions.

The preferred branch of pull requests is the `develop` branch. Additionally, we are frequently adding small bounties on Gitcoin for mission-critical initiatives.

Thanks for being awesome!
