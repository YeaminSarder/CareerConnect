const Profile = require("../models/profile");
const mongoose = require('mongoose')
// GET /api/profiles
const getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find({})
            .sort({ createdAt: -1 });

        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// GET /api/profiles/:id
const getProfile = async (req, res) => {
	try {
        const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({"msg":"No such profile"})
		}

        const profile = await Profile.findById(id);

        if (!profile) {
            return res.status(404).json({
                msg: "Profile not found",
            });
        }

        res.status(200).json(profile);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// POST /api/profiles
const createProfile = async (req, res) => {
    try {
        const { name, age } = req.body;

        const profile = await Profile.create({
            name,
            age,
        });

        res.status(201).json(profile);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// PATCH /api/profiles/:id
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({"msg":"No such profile"})
		}
        const profile = await Profile.findByIdAndUpdate(
            id,
            req.body,
            {
                returnDocument: 'after', // Return the updated document
                runValidators: true // Validate the update
            }
        );

        if (!profile) {
            return res.status(404).json({
                msg: "Profile not found",
            });
        }

        res.status(200).json(profile);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

// DELETE /api/profiles/:id
const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({"msg":"No such profile"})
		}
        const profile = await Profile.findByIdAndDelete(id);

        if (!profile) {
            return res.status(404).json({
                msg: "Profile not found",
            });
        }

        res.status(200).json({
            msg: "Profile deleted successfully",
        });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

module.exports = {
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
};
