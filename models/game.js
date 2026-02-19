const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    // Add schema fields as needed
});

module.exports = mongoose.model('Game', gameSchema);
