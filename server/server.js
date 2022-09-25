const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000',
    methods: ['GET', 'POST']
  }
});
const cors = require('cors');
const inMemoryDatabase = require('./database');
const { messageModel } = require('./database');
const bodyParser = require('body-parser');

const animals = ['lizard', 'platypus', 'axolotl', 'shark', 'bat', 'turtle', 'blobfish', 'moth', 'slug', 'octopus', 'starfish', 'ant', 'antelope', 'mantis', 'remora'];
const adjectives = [ 'advanterous', 'annoying', 'brave', 'charismatic', 'charming', 'cheesy', 'clownish', 'crackpot', 'deranged', 'eccentric', 'goofy', 'hysterical', 'jokey', 'ludicrous', 'nutty', 'quirky', 'savage', 'unpredictable', 'zesty' ];

app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

io.on('connection', () => {
  const username = adjectives[Math.round(Math.random() * (adjectives.length - 1))] + ' ' +  animals[Math.round(Math.random() * (animals.length - 1))];
  io.emit('username', username);
});

app.get('/messages', (request, response) => {
  messageModel.find({}, (error, messages) => {
    response.send(messages);
  });
});

app.post('/messages', (request, response) => {
  const message = new messageModel(request.body);
   message.save((error) => {
    if (error) {
      response.sendStatus(500);
    }
    io.emit('message', request.body);
    response.sendStatus(200);
  });
});

server.listen(3000, () => {
  console.log('server is running on port', server.address().port);
  inMemoryDatabase.connect();
});

function serverLog(message) {
  console.log('[SLUR SERVER] ' + message );
}