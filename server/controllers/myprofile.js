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
            : { completionPercentage: 0, missingFields: [] };

        res.status(200).json({
            ...profile.toObject(),
            completionPercentage: completion.completionPercentage,
            missingFields: completion.missingFields
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export default {
    getProfile
};