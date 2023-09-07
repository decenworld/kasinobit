import React, { useState, useEffect } from 'react'; // <-- Add "React," before "useState" and "useEffect"
import { Form, Button } from 'react-bootstrap';
import { playCoinFlip, connectAndInitialize } from './Contract.js';
import headsImage from './assets/img/tails.webp';
import tailsImage from './assets/img/heads.webp';

const { ethers } = require('ethers');

const contractAddress = '0x61c2FDb9AB14eEBe63ee8c6cf668e233864576A1';
const contractABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"requestId","type":"uint256"}],"name":"CoinFlipRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"didWin","type":"bool"}],"name":"CoinFlipResult","type":"event"},{"inputs":[{"internalType":"enum CoinFlipx.CoinFlipSelection","name":"choice","type":"uint8"}],"name":"flip","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"}],"name":"getStatus","outputs":[{"components":[{"internalType":"uint256","name":"fees","type":"uint256"},{"internalType":"uint256","name":"randomword","type":"uint256"},{"internalType":"address","name":"player","type":"address"},{"internalType":"bool","name":"didWin","type":"bool"},{"internalType":"bool","name":"fulfilled","type":"bool"},{"internalType":"enum CoinFlipx.CoinFlipSelection","name":"choice","type":"uint8"},{"internalType":"uint256","name":"additionalAmount","type":"uint256"}],"internalType":"struct CoinFlipx.CoinFlipStatus","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maximumBettingAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_requestId","type":"uint256"},{"internalType":"uint256[]","name":"_randomWords","type":"uint256[]"}],"name":"rawFulfillRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newMaxAmount","type":"uint256"}],"name":"setMaxBettingAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"statuses","outputs":[{"internalType":"uint256","name":"fees","type":"uint256"},{"internalType":"uint256","name":"randomword","type":"uint256"},{"internalType":"address","name":"player","type":"address"},{"internalType":"bool","name":"didWin","type":"bool"},{"internalType":"bool","name":"fulfilled","type":"bool"},{"internalType":"enum CoinFlipx.CoinFlipSelection","name":"choice","type":"uint8"},{"internalType":"uint256","name":"additionalAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"}];

function sleep(ms) {
  return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
}

export async function getEventLogs(provider, contractAddress, contractABI) {
  try {
    provider = await new ethers.BrowserProvider(window.ethereum);
    await sleep(2000);

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const eventName = 'CoinFlipRequest';
    await sleep(5000);

    const filter = await contract.filters[eventName]();
        await sleep(8000);
    const logs = await provider.getLogs({
      address: contractAddress,
      fromBlock: 67937161, // Replace with the starting block number
      toBlock: 'latest',
      topics: filter.topics,
    });
        await sleep(1000);
    console.log(logs)
    const latestLog = await logs[logs.length - 1];
            await sleep(500);
    if (latestLog) {
      const latestData = await latestLog.data;
                  await sleep(500);
      const lastCharacter = latestData.slice(-1);
                  await sleep(500);
      const outcome = parseInt(lastCharacter);
            await sleep(500);

      console.log(latestData);
      if (outcome === 0) {
        return 'You lost';
      } else if (outcome === 1) {
        return 'You won';
      } else {
        return 'You lost'; // invalid outcome
      }
    } else {
      return 'No event logs found.';
    }
  } catch (error) {
    console.error('Error retrieving event logs:', error);
    return 'Error retrieving event logs';
  }
}

const CoinFlipForm = () => {
  const [wager, setWager] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [isHeads, setIsHeads] = useState(false); // Set default coin to "Tails"
  const [numBets, setNumBets] = useState(1);
  const [stopGain, setStopGain] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [finalFace, setFinalFace] = useState(null);
  const [profit, setProfit] = useState('0.96'); // Default profit is '1.97'
  const [outcome, setOutcome] = useState(null);
  const [outcomeLoaded, setOutcomeLoaded] = useState(false); // Add this line
  const [isWalletConnected, setIsWalletConnected] = useState(false); // Wallet connection status
  const customRPC = 'https://rpc.fantom.network'; // Fantom testnet RPC endpoint


  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      // Check if the wallet is connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setIsWalletConnected(accounts.length > 0);
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setIsWalletConnected(false);
    }
  };

  const connectWallet = async () => {
    try {
      // Request the user to connect the wallet
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsWalletConnected(accounts.length > 0);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setIsWalletConnected(false);
    }
  };

  const handleCoinClick = (side) => {
    setIsHeads(side === 'heads');
    setFlipCount(0); // Reset flipCount for each flip
    setIsAnimating(true);
    setFinalFace(null); // Reset the finalFace state when starting a new flip

    const totalFlips = side === 'heads' ? 6 : 6; // 6 flips for both heads and tails
    const flipInterval = 350;

    const flipCoin = (currentFlip) => {
      if (currentFlip <= totalFlips) {
        setTimeout(() => {
          setFlipCount(currentFlip);
          flipCoin(currentFlip + 1);
        }, flipInterval);
      } else {
        setIsAnimating(false);
        setFinalFace(side === 'heads');
      }
    };

    flipCoin(1);
  };
const handleSubmit = async (event) => {
  event.preventDefault();
  const parsedWager = parseFloat(wager);
  const finalWager = isNaN(parsedWager) ? 1 : parsedWager;

  // Reset the outcome and outcomeLoaded state
  setOutcome(null);
  setOutcomeLoaded(false);

  try {
    // Attempt to play the coin flip
    const isTransactionSuccessful = await playCoinFlip(finalWager, tokenAddress, isHeads, numBets, stopGain, stopLoss);

    if (isTransactionSuccessful) {
      // Play Coin Flip successfully executed, now fetch the outcome
      const outcome = await getEventLogs(connectAndInitialize, contractAddress, contractABI);
      setOutcome(outcome);
    }
    setOutcomeLoaded(true); // Set outcomeLoaded to true once the outcome is obtained
  } catch (error) {
    console.error('Error playing Coin Flip:', error);
    // Handle the error here, for example, show an error message to the user
    // or set the outcome to an error state
    setOutcome('Error playing Coin Flip');
    setOutcomeLoaded(true);
  }
};


  const handleWagerChange = (e) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);

    if (!value || value === '.' || isNaN(parsedValue)) {
      setWager('');
      setProfit('0');
    } else {
      setWager(parsedValue);
      const profitValue = (parsedValue * 9600) / 10000;
      const formattedProfit = profitValue.toFixed(2);
      setProfit(formattedProfit);
    }
  };

  

  return (
    
    <Form onSubmit={handleSubmit}>
      <div style={{color:"white", marginTop:"2rem"}}>
  The first 50.000 FTM used for betting will get airdropped 1% of the supply of our upcoming token, the more you ftm you play with the more you get!
</div>
      <div style={{color:"white", marginTop:"2rem"}}>
  Due to we just released a few days ago and are still en BETA maximum bet is 5 FTM per round, maximum bet will increase soon!
</div>
<div className="wrapper">
   <div className={'CoinFlip_container'} style={{ display: 'flex' }}>
    
     <div className="first">

    {isHeads !== null && (
      <div className={`chosen-coin-container ${isAnimating ? 'animate' : ''}`}>
        <div className={`coin-flip coin-flip-${flipCount}`}>
          {flipCount % 2 === 0 ? (
            <div className="coin-face">
              {finalFace !== null && finalFace ? (
                <img src={headsImage} className={'bigcoinimg'} alt="Heads" />
              ) : (
                <img src={tailsImage} className={'bigcoinimg'} alt="Tails" />
              )}
            </div>
          ) : (
            <div className="coin-face">
              {finalFace !== null && finalFace ? (
                <img src={tailsImage} className={'bigcoinimg'} alt="Tails" />
              ) : (
                <img src={headsImage} className={'bigcoinimg'} alt="Heads" />
              )}
            </div>
          )}
        </div>
      </div>
    )}
  <div className="coin-container">
    <div
      className={`coin ${isHeads === false ? 'selected' : ''}`}
      onClick={() => handleCoinClick('tails')}
    >
      <img src={tailsImage} className={'coinimg'} alt="Tails" />
    </div>
          
    <div
      className={`coin ${isHeads === true ? 'selected' : ''}`}
      onClick={() => handleCoinClick('heads')}
    >
      <img src={headsImage} className={'coinimg'} alt="Heads" />
    </div>
    
  </div>
  </div>
    <div className="second">
  <div className={'WagerInput'} style={{ marginLeft: '20px' }}>
    <Form.Group controlId="formWager">
      <div className={'WagerInput_header'}>
        <div className={'WagerInput_title'}>
          <Form.Label>Wager</Form.Label>
        </div>
      </div>
            
      <Form.Control
        type="text" // Change type to 'text' to allow empty input
        value={wager}
        onChange={handleWagerChange}
        placeholder="1"
        min={0}
      />
      <div className={'ProfitToWin'}>
        <br></br>
        <span style={{ color: "white" }}>Profit to Win:</span>
        <span>
          <div className='win'>{profit}</div>
        </span>
      </div>
      
      {outcomeLoaded && (
        <div className="outcome-container">
          <span>{outcome}</span>
        </div>
      )}
<br></br>
      {isWalletConnected ? (
        <Button variant="primary" className={'Button'} type="submit">
          Play Coin Flip
        </Button>
      ) : (
        <Button variant="primary" className={'Button'} onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </Form.Group>
    </div>
  </div>
</div>
</div>
<div style={{color:"white"}}>
  Coin Flip
A simple heads-or-tails game. 50% chance of winning with a 1.98x multiplier.
Simply type in your wager amount and flip the coin!
</div>
      <style jsx>{`

   .wrapper {
    border: 0px solid black;
}
.first {
        display: inline-block;
}
.second {
   display: inline-block;
}
.outcome-container{
  color: white;
}

        .Middle_Container {
          
          --color: hsl(42, 30%, 15%);
          background: radial-gradient(circle at 50% 0, #2d3036, #2d3036);
          background: radial-gradient(circle at 50% 100%, #322b1b, #171617) 90%);
            width: 100%; /* This will make the app-container stretch to the full width */
            height: 100%;
        }
        .win {
          color: lime;
        }
 .Button {
  position: relative;
  font-weight: 700;
  border-radius: 5px;
  background-color: #e92277;
  color: #fff;
  width: 140px;
  padding: 15px;
  text-align: center;
  text-transform: uppercase;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 2px solid #ff427d;
  background-image: linear-gradient(45deg, #e92277, #ff427d);
  cursor: pointer;
}

.Button:hover {
  background-image: linear-gradient(45deg, #ff427d, #e92277);
  transform: scale(1.05);
}

.Button:active {
  box-shadow: none;
  transform: translateY(2px);
}

.Button::before {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-right: 10px;
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
}

/* Add the Font Awesome CSS link if you haven't already */

Make sure you have included the Font Awesome CSS link in your HTML file before using the above CSS code. Additionally, you can change the dice icon representation by choosing a different Unicode character or using a different Font Awesome icon class.

        .ProfitToWin {
          font-weight: 700;
    color: #00ff00;
        }
        .CoinFlip_container {
          display: grid;
          grid-gap: 10px;
          gap: 10px;
          justify-content: space-evenly;
          align-items: center;
          width: 300px;
          padding: 10px;
        }

        .coinimg {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        .bigcoinimg {
          border: 4px solid #fdc66c;
          box-shadow: 0 0 20px #fdc66c, inset 0 0 20px 0 #111011;
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }

        .WagerInput {
          width: 200px;
          height: -moz-fit-content;
          height: fit-content;
          padding: 5px 10px 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
          position: relative;
        }

        .WagerInput_header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          margin-top: 5px;
          margin-bottom: 5px;
        }

        .WagerInput_title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: small;
          color: white;
        }

        .coin-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          margin-bottom: 20px;
        }

        .coin {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          color: #333;
          cursor: pointer;
          margin-right: 10px;
        }

        .coin.selected {
          background-color: #f6c74f;
          color: #fff;
        }

        .chosen-coin-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          width: 200px;
          overflow: hidden; /* Ensure the images don't overflow */
        }

        .chosen-coin-container.animate {
          animation: flip 1s linear;
        }

        .chosen-coin-container.animate .coin-flip {
          animation-duration: 1s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .chosen-coin-container.animate .coin-flip:nth-child(odd) {
          animation-name: flip-odd;
        }

        .chosen-coin-container.animate .coin-flip:nth-child(even) {
          animation-name: flip-even;
        }

        /* Define keyframes for flip animation */
        @keyframes flip-odd {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg);
            z-index: 1;
          }
          100% {
            transform: rotateY(360deg);
            z-index: 0;
          }
        }

        @keyframes flip-even {
          0% {
            transform: rotateY(180deg);
          }
          50% {
            transform: rotateY(360deg);
            z-index: 0;
          }
          100% {
            transform: rotateY(540deg);
            z-index: 1;
          }
        }

        /* Define the flip animation */
        @keyframes flip {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </Form>
  );
};

export default CoinFlipForm;