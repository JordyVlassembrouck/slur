const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

let messageModel = mongoose.model('Message', {name: String, message: String})

const connect = async () => {
  await mongoose.disconnect();

  mongoServer = await MongoMemoryServer.create();

  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, opts, error => {
    if (error) {
      console.log(error);
    } else {
      console.log('Database connected');
    }
  });
};

const close = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('Database closed');
};

const clear = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany();
  }

  console.log('Database cleared');
};

module.exports = {
  connect,
  close,
  clear,
  messageModel
}