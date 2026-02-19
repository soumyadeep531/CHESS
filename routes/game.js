const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { updateRatings } = require('../utils/elo');
const User = require('../models/user');

// Route to record game result (simplified for AI match for now)
// In a real multiplayer app, this would be called by the server after a socket game ends.
// For now, let's allow the client to post a result against AI (which we can simulate as a "bot" user or just update player stats).

// Create a dummy "AI" user if it doesn't exist? 
// Or better: Let's focus on updating Player rating based on win/loss against "Rated AI" (simulated rating 1200, 1400, etc.)

router.post('/game/result', ensureAuthenticated, async (req, res) => {
    const { result, difficulty } = req.body; // result: 'win', 'loss', 'draw'
    const player = res.locals.user;

    // Define AI ratings
    let aiRating = 1000;
    if (difficulty === 'minimax') aiRating = 1500;

    // Calculate new player rating
    // We treat AI as a temporary opponent
    const kFactor = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (aiRating - player.rating) / 400));

    let actualScore = 0;
    if (result === 'win') actualScore = 1;
    else if (result === 'draw') actualScore = 0.5;

    const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
    const newRating = player.rating + ratingChange;

    try {
        await User.findByIdAndUpdate(player._id, { rating: newRating });
        res.json({ success: true, newRating, ratingChange });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
