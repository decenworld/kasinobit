import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { playCoinFlip } from './Contract';

const CoinFlipForm = () => {
  const [wager, setWager] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [isHeads, setIsHeads] = useState(true);
  const [numBets, setNumBets] = useState(1);
  const [stopGain, setStopGain] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await playCoinFlip(wager, tokenAddress, isHeads, numBets, stopGain, stopLoss);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formWager">
        <Form.Label>Wager</Form.Label>
        <Form.Control type="number" value={wager} onChange={(e) => setWager(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formTokenAddress">
        <Form.Label>Token Address</Form.Label>
        <Form.Control type="text" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formIsHeads">
        <Form.Check
          type="checkbox"
          label="Is Heads?"
          checked={isHeads}
          onChange={(e) => setIsHeads(e.target.checked)}
        />
      </Form.Group>
      <Form.Group controlId="formNumBets">
        <Form.Label>Number of Bets</Form.Label>
        <Form.Control type="number" value={numBets} onChange={(e) => setNumBets(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formStopGain">
        <Form.Label>Stop Gain</Form.Label>
        <Form.Control type="number" value={stopGain} onChange={(e) => setStopGain(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formStopLoss">
        <Form.Label>Stop Loss</Form.Label>
        <Form.Control type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Play Coin Flip
      </Button>
    </Form>
  );
};

export default CoinFlipForm;
