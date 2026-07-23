const mongoose = require('mongoose');
const Profile = require('../models/profile');
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

        res.status(200).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getProfile
};