import {Web3} from 'web3';
// set a provider in the sepolia testnet using node rpc url
const web3 = new Web3('https://rpc.sepolia.org');

const ContractABI = [
  {
    inputs: [],
    name: 'myCity',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// interacting with the smart contract
const address = '0x026EaE2001b19D128B1De91a88a57a7fEB0cA7b0';
// create a new contract object, providing the ABI and address
const contract = new web3.eth.Contract(ContractABI, address);
// using contract.methods to get value
// contract.methods.generateRandomNumber().call().then(console.log);
// Get the balance of an Ethereum address
web3.eth
  .getBalance('0xBfA25A6ff03b2A0edD94028D03AcF4B3A1627e7f')
  .then(console.log);

contract.methods
  .myCity()
  .call()
  .then(city => {
    console.log('My City:', city);
  })
  .catch(error => {
    console.error('Error:', error);
  });