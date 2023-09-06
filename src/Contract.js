import { useState, useEffect } from 'react';
import { getEventLogs } from './CoinFlipForm';

import Header from './Header';
const {ethers, utils} = require('ethers');
const { BigNumber } = require('bignumber.js');

const { Contract, providers } = ethers;

const contractAddress = '0x764f842cbe1a3721d93cc017816c7f3acc9f2ec4';
const contractABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"requestId","type":"uint256"}],"name":"CoinFlipRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"didWin","type":"bool"}],"name":"CoinFlipResult","type":"event"},{"inputs":[{"internalType":"enum CoinFlip.CoinFlipSelection","name":"choice","type":"uint8"}],"name":"flip","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"}],"name":"getStatus","outputs":[{"components":[{"internalType":"uint256","name":"fees","type":"uint256"},{"internalType":"uint256","name":"randomword","type":"uint256"},{"internalType":"address","name":"player","type":"address"},{"internalType":"bool","name":"didWin","type":"bool"},{"internalType":"bool","name":"fulfilled","type":"bool"},{"internalType":"enum CoinFlip.CoinFlipSelection","name":"choice","type":"uint8"}],"internalType":"struct CoinFlip.CoinFlipStatus","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_requestId","type":"uint256"},{"internalType":"uint256[]","name":"_randomWords","type":"uint256[]"}],"name":"rawFulfillRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"statuses","outputs":[{"internalType":"uint256","name":"fees","type":"uint256"},{"internalType":"uint256","name":"randomword","type":"uint256"},{"internalType":"address","name":"player","type":"address"},{"internalType":"bool","name":"didWin","type":"bool"},{"internalType":"bool","name":"fulfilled","type":"bool"},{"internalType":"enum CoinFlip.CoinFlipSelection","name":"choice","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"}]

let provider;
let signer;
let coinFlipContract;

const stopGainValue = new BigNumber('7237005577332262213973186563042994240829374041602535252466099000494570602496');
const stopLossValue = new BigNumber('7237005577332262213973186563042994240829374041602535252466099000494570602496');



function sleep(ms) {
  return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
}

const customRPC = 'https://rpc.testnet.fantom.network'; // Fantom testnet RPC endpoint
const chainId = 4002; // Chain ID of the Fantom testnet (Fantom Opera)

export async function connectAndInitialize() {
  try {
    // Check if Metamask (or other injected provider) is available
    if (typeof window.ethereum !== 'undefined') {
      // Get the injected Ethereum provider from Metamask
      provider = new ethers.BrowserProvider(window.ethereum, chainId); // Specify the chain ID

      // Set up the custom RPC if available
      if (customRPC) {
        provider.pollingInterval = 1000; // You can adjust the polling interval if needed
        provider._getProvider = chainId;
      }

      // Request user accounts and connect to the provider
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      signer = await provider.getSigner();
      console.log("Connected to Metamask");

      // Create the contract instance using the signer
      coinFlipContract = new ethers.Contract(contractAddress, contractABI, signer);

      // Now you can interact with the contract using coinFlipContract
      // For example, you can call contract functions or listen to contract events
      const blockNumber = await provider.getBlockNumber();
      console.log("Current block number: " + blockNumber);

      return provider;
    } else {
      console.error("Metamask (or other injected provider) is not available.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the connectAndInitialize function to start the connection process
connectAndInitialize();

    coinFlipContract = await new ethers.Contract(contractAddress, contractABI, signer);


    const contract = new ethers.Contract(contractAddress, contractABI, provider);


export async function playCoinFlip(wager, tokenAddress, isHeads, numBets, stopGain, stopLoss) {
  try {
    if (!coinFlipContract) {
      throw new Error('CoinFlip contract not initialized');
    }

    const convert = "000000000000000000";
    const new_wager = wager.toString() + convert;
    console.log(new_wager);
    const newwager = parseFloat(new_wager);

    const tx = await signer.sendTransaction({
      to: contractAddress,
      from: await signer.getAddress(),
      value: new_wager,
      data: coinFlipContract.interface.encodeFunctionData('flip', ["0"]),
      gasLimit: 500000,
    });
    await sleep(1000);

    // Wait for the transaction receipt to check if it was successful
    const receipt = await tx.wait();
    await sleep(1000);
    if (!receipt.status) {
      throw new Error('Transaction failed'); // Throw an error if the transaction failed
    }

    console.log('Transaction successful');
    console.log(receipt);

    return true; // Return true if the transaction was successful
  } catch (error) {
    console.error('Transaction failed:', error);
    return false; // Return false if the transaction failed
  }
}



async function setupProvider() {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = provider.getSigner();
        console.log("connected");

    coinFlipContract = new ethers.Contract(contractAddress, contractABI, signer);
    return true; // Return true to indicate successful initialization
  } else {
    console.error('Metamask not detected');
    return false; // Return false to indicate initialization failure
  }
}


function App() {
  const [wager, setWager] = useState(0);
  const [numBets, setNumBets] = useState(1);
  const [stopGain, setStopGain] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function initializeProvider() {
      const initialized = await setupProvider();
      setConnected(initialized);
    }
    initializeProvider();
  }, []);

  const handlePlayCoinFlip = async () => {
    try {
      const tokenAddress = '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75'; // Provide the actual token address
      const isHeads = true; // Provide the actual value for isHeads
      await playCoinFlip(wager, tokenAddress, isHeads, numBets, stopGain, stopLoss);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div className="App">

      {/* Your component JSX */}
      <button className="button BetButton_bet_button__HFCLu" disabled={!connected} onClick={handlePlayCoinFlip}>
        Connect First
      </button>
    </div>
  );
}

export default App;