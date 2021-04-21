if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const routes = require('./routes/index.js');
const errorHandler = require('./middlewares/errorHandler.js');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

global.__basedir = __dirname;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);
app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('socket.io connected');

  socket.on('sendChat', (chatData) => {
    socket.broadcast.emit('getSendChat', chatData);
  });

  socket.on('updateAuction', (auctionData) => {
    socket.broadcast.emit('getAuctionData', auctionData);
  });

  socket.on('auctionWinnerToOther', () => {
    socket.broadcast.emit('getAuctionWinnerToOther');
  });

  socket.on('auctionWinnerToSelf', () => {
    socket.emit('getAuctionWinnerToSelf');
  });

  socket.on('updateAuctionTime', (time) => {
    io.emit('getAuctionTime', time);
  });

  socket.on('updateBalance', (balanceData) => {
    socket.emit('getBalanceData', balanceData);
  });
});

module.exports = http;
