const User = require('../models/user');

const calculateNewRatings = (winnerRating, loserRating, kFactor = 32) => {
    // Calculate expected score for winner
    const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));

    // Calculate expected score for loser
    const expectedScoreLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

    // Update ratings
    const newWinnerRating = Math.round(winnerRating + kFactor * (1 - expectedScoreWinner));
    const newLoserRating = Math.round(loserRating + kFactor * (0 - expectedScoreLoser));

    return { newWinnerRating, newLoserRating };
};

const updateRatings = async (winnerId, loserId) => {
    try {
        // Logic for multiplayer update (User vs User)
        const winner = await User.findById(winnerId);
        const loser = await User.findById(loserId);

        if (!winner || !loser) {
            throw new Error('User not found');
        }

        const { newWinnerRating, newLoserRating } = calculateNewRatings(winner.rating, loser.rating);

        winner.rating = newWinnerRating;
        loser.rating = newLoserRating;

        await winner.save();
        await loser.save();

        return {
            winner: { username: winner.username, newRating: newWinnerRating },
            loser: { username: loser.username, newRating: newLoserRating }
        };

    } catch (error) {
        console.error('Error updating ratings:', error);
        throw error;
    }
};

module.exports = { calculateNewRatings, updateRatings };
