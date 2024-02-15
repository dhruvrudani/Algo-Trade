import { WebSocket } from 'ws';
import config from 'config';

const apiKey = config.get('api_key');
const accessToken = 'YOUR_ACCESS_TOKEN';

// List of instruments to subscribe to
const instruments = ["NSE:INFY", "NSE:SENSEX", "NSE:MIDCAP", "NSE:NIFTY50", "NSE:BANKNIFTY"];

// Connect to Kite Connect WebSocket API
const ws = new WebSocket('wss://ws.kite.trade?api_key=' + apiKey + '&access_token=' + accessToken);

ws.on('open', function open() {
  console.log('Connected to Kite WebSocket API');

  // Subscribe to the list of instruments
  ws.send(JSON.stringify({
    "a": "subscribe",
    "v": instruments
  }));
});

ws.on('message', function incoming(data) {
  // Handle incoming data
  console.log('Received:', data);
});

ws.on('close', function close() {
  console.log('Disconnected from Kite WebSocket API');
});

ws.on('error', function (error) {
  console.error('WebSocket error:', error);
});