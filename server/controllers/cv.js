import Cv from '../models/cv.js';
import mongoose from 'mongoose';

export const validateCvId = async (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid CV ID' });
    }
    const cv = await Cv.findById(id);
    if (!cv) {
        return res.status(404).json({ error: 'CV not found' });
    }
    if (cv.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized access to this CV' });
    }
    req.cv = cv;
    next();
}

// Get all CVs
export const getAllCvs = async (req, res) => {
    try {
        const cvs = await Cv.find();
        res.json(cvs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single CV by ID
export const getCvById = async (req, res) => {
    try {
        res.json(req.cv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new CV
export const createCv = async function createCv(req, res) {
    try {
        const cv = await Cv.user_create(req.user._id, req.body)
        res.status(201).json(cv);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a CV
export const updateCv = async (req, res) => {
    try {
        console.log("updateCv", req.cv, req.body)
        const cv = await req.cv.updateOne(req.body, { new: true, runValidators: true });
        if (!cv) {
            return res.status(404).json({ error: 'CV not found' });
        }
        res.json(cv);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a CV
export const deleteCv = async (req, res) => {
    try {
        await req.cv.deleteOne();
        res.json({ message: 'CV deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyCvs = async (req, res) => {
    try {
        const id = req.user._id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({"error":"invalid user",id: id})
        }

        const cvs = await Cv.find({ ...req.body, user: id });

        if (!cvs) {
            return res.status(404).json({
                error: "No CVs found for this user",
            });
        }

        res.status(200).json(cvs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export default {
    getAllCvs,
    getCvById,
    createCv,
    updateCv,
    deleteCv,
    getMyCvs,
    validateCvId
};
