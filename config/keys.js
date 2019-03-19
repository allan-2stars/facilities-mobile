// Datebase URI
exports.mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-ofmxm.mongodb.net/${process.env.MONGO_DAFAULT_DATABASE}`;

// Secret Or Private Key
exports.secretOrPrivateKey = process.env.SECRET_OR_PRIVATE_KEY;
// Server Port
exports.PORT = process.env.PORT;
