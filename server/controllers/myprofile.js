import mongoose from 'mongoose';
import Profile from '../models/profile.js'
const getProfile = async (req, res) => {
    try {
        const id = req.user.profile;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({"error":"No such profile",id: id})
        }

        const profile = await Profile.findById(id);

        if (!profile) {
            return res.status(404).json({
                error: "Profile not found",
            });
        }

        const completion = typeof profile.getCompletionScore === 'function'
            ? profile.getCompletionScore()
            : { completionPercentage: 0, breakdown: [], suggestions: [] };

        res.status(200).json({
            ...profile.toObject(),
            completionPercentage: completion.completionPercentage,
            breakdown: completion.breakdown,
            suggestions: completion.suggestions
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const id = req.user.profile;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ "error": "No such profile", id: id });
        }

        const updateData = {
            ...req.body,
            lastUpdated: new Date()
        };

        const profile = await Profile.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!profile) {
            return res.status(404).json({
                error: "Profile not found",
            });
        }

        const completion = typeof profile.getCompletionScore === 'function'
            ? profile.getCompletionScore()
            : { completionPercentage: 0, breakdown: [], suggestions: [] };

        res.status(200).json({
            ...profile.toObject(),
            completionPercentage: completion.completionPercentage,
            breakdown: completion.breakdown,
            suggestions: completion.suggestions
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export default {
    getProfile,
    updateMyProfile
};